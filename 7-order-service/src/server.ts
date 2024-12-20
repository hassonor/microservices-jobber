import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@ohjobber/shared';
import { orderConfig } from '@order/config';
import { Application, Response, Request, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@order/elasticsearch';
import { appRoutes } from '@order/routes';
import { Channel } from 'amqplib';
import { Server } from 'socket.io';
import { createRabbitMQConnection } from '@order/queues/connection';
import { consumerReviewFanoutMessages } from '@order/queues/consumers/order';

const SERVER_PORT = 4006;

const log: Logger = winstonLogger(`${orderConfig.ELASTIC_SEARCH_URL}`, 'chatServer', 'debug');
let orderChannel: Channel;
let socketIOChatObject: Server;
const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  chatErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: orderConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization!.split(' ')[1];
      const payload = verify(token, orderConfig.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const startQueues = async (): Promise<void> => {
  orderChannel = (await createRabbitMQConnection()) as Channel;
  await consumerReviewFanoutMessages(orderChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const chatErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `OrderService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    const socketIO: Server = await createSocketIO(httpServer);
    startHttpServer(httpServer);
    socketIOChatObject = socketIO;
  } catch (error) {
    log.log('error', 'OrderService startServer() method error:', error);
  }
};

const createSocketIO = async (httpServer: http.Server): Promise<Server> => {
  const io: Server = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
  });
  return io;
};

const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`Order server has started with process is ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Order server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'OrderService startHttpServer() method error:', error);
  }
};

export { start, orderChannel, socketIOChatObject };