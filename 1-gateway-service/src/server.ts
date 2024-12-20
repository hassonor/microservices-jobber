import 'express-async-errors';
import http from 'http';
import * as process from 'process';

import { CustomError, winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { Application, json, Request, Response, NextFunction, urlencoded } from 'express';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { gatewayConfig } from '@gateway/config';
import { appRoutes } from '@gateway/routes';
import { checkElasticSearchConnection } from '@gateway/elasticsearch';
import { axiosAuthInstance } from '@gateway/services/api/authService';
import { axiosBuyerInstance } from '@gateway/services/api/buyerService';
import { axiosSellerInstance } from '@gateway/services/api/sellerService';
import { axiosGigInstance } from '@gateway/services/api/gigService';
import { Server } from 'socket.io';
import { SocketIOAppHandler } from '@gateway/sockets/socket';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { axiosMessageInstance } from '@gateway/services/api/messageService';
import { axiosOrderInstance } from '@gateway/services/api/orderService';
import { axiosReviewInstance } from '@gateway/services/api/reviewService';
import axios, { AxiosError } from 'axios';

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(`${gatewayConfig.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');
export let socketIO: Server;

export class GatewayServer {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();

    // Register the error handler after all middleware and routes
    this.errorHandler(this.app);

    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${gatewayConfig.SECRET_KEY_ONE}`, `${gatewayConfig.SECRET_KEY_TWO}`],
        maxAge: 24 * 2 * 3600000, // 2 days
        secure: gatewayConfig.NODE_ENV !== 'development',
        ...(gatewayConfig.NODE_ENV !== 'development' && {
          sameSite: 'none'
        })
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: gatewayConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        const authHeader = `Bearer ${req.session.jwt}`;
        axiosAuthInstance.defaults.headers['Authorization'] = authHeader;
        axiosBuyerInstance.defaults.headers['Authorization'] = authHeader;
        axiosSellerInstance.defaults.headers['Authorization'] = authHeader;
        axiosGigInstance.defaults.headers['Authorization'] = authHeader;
        axiosMessageInstance.defaults.headers['Authorization'] = authHeader;
        axiosOrderInstance.defaults.headers['Authorization'] = authHeader;
        axiosReviewInstance.defaults.headers['Authorization'] = authHeader;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ extended: true, limit: '100mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    checkElasticSearchConnection();
  }

  private errorHandler(app: Application): void {
    // 404 Not Found Middleware
    app.use('*', (req: Request, res: Response) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.error(`${fullUrl} endpoint does not exist.`);
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.' });
    });

    // Error-Handling Middleware
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      // Handle Axios errors
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        const status = axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
        const data = axiosError.response?.data as { message?: string; error?: string };
        log.error(`Axios Error - Status: ${status}, Data: ${JSON.stringify(data)}`);
        return res.status(status).json({ message: data?.message || data?.error || 'An error occurred.' });
      }

      // Handle CustomError instances
      if (err instanceof CustomError) {
        log.error(`CustomError - Status: ${err.statusCode}, Message: ${err.message}`);
        return res.status(err.statusCode).json(err.serializeErrors());
      }

      // Handle generic errors
      if (err instanceof Error) {
        log.error(`GatewayService Error: ${err.message}\nStack: ${err.stack}`);
      } else {
        log.error('GatewayService Error: Unknown error');
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIOInstance: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIOInstance);
    } catch (error) {
      log.error('GatewayService startServer() error method:', error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: `${gatewayConfig.CLIENT_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: gatewayConfig.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    socketIO = io;
    return io;
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id: ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Gateway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.error('GatewayService startHttpServer() error method:', error);
    }
  }

  private socketIOConnections(io: Server): void {
    const socketIoApp = new SocketIOAppHandler(io);
    socketIoApp.listen();
  }
}
