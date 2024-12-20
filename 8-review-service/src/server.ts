import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@ohjobber/shared';
import { reviewConfig } from '@review/config';
import { Application, Response, Request, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { appRoutes } from '@review/routes';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@review/queues/connection';

const SERVER_PORT = 4007;

const log: Logger = winstonLogger(`${reviewConfig.ELASTIC_SEARCH_URL}`, 'reviewService', 'debug');
let reviewChannel: Channel;
const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  reviewErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: reviewConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization!.split(' ')[1];
      const payload = verify(token, reviewConfig.JWT_TOKEN!) as IAuthPayload;
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
  reviewChannel = (await createRabbitMQConnection()) as Channel;
};

const startElasticSearch = (): void => {
  // checkConnection();
};

const reviewErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `ReviewService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    startHttpServer(httpServer);
  } catch (error) {
    log.log('error', 'ReviewService startServer() method error:', error);
  }
};

const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`Review server has started with process is ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Review server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'ReviewService startHttpServer() method error:', error);
  }
};

export { start, reviewChannel };
