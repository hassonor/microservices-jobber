import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@ohjobber/shared';
import { authConfig } from '@auth/config';
import { Application, Response, Request, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { appRoutes } from '@auth/routes';
import { createRabbitMQConnection } from '@auth/queues/connection';
import { Channel } from 'amqplib';
import { checkElasticSearchConnection, createIndex } from '@auth/elasticsearch';

const SERVER_PORT = 4002;

const log: Logger = winstonLogger(`${authConfig.ELASTIC_SEARCH_URL}`, 'authServer', 'debug');

export let authChannel: Channel;

export const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();

  // Ensure the error handler is registered after the routes
  authErrorHandler(app);

  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: authConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization!.split(' ')[1];
      const payload = verify(token, authConfig.JWT_TOKEN!) as IAuthPayload;
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
  authChannel = (await createRabbitMQConnection()) as Channel;
};

const startElasticSearch = (): void => {
  checkElasticSearchConnection();
  createIndex('gigs');
};

// Corrected error handler
const authErrorHandler = (app: Application): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
    log.error(`AuthService ${err.comingFrom}:`, err);

    if (err instanceof CustomError) {
      return res.status(err.statusCode).json(err.serializeErrors());
    }

    res.status(500).json({ message: 'Internal Server Error' });
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Auth server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Auth server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.error('AuthService startServer() method error:', error);
  }
};
