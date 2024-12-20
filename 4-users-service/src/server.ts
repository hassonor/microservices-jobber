import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@ohjobber/shared';
import { usersConfig } from '@users/config';
import { Application, Response, Request, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkElasticSearchConnection } from '@users/elasticsearch';
import { appRoutes } from '@users/routes';
import { createRabbitMQConnection } from '@users/queues/connection';
import { Channel } from 'amqplib';
import { consumeBuyerDirectMessage, consumeSellerDirectMessage } from '@users/queues/userConsumer';

const SERVER_PORT = 4003;

const log: Logger = winstonLogger(`${usersConfig.ELASTIC_SEARCH_URL}`, 'usersServer', 'debug');

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  usersErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: usersConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization!.split(' ')[1];
      const payload = verify(token, usersConfig.JWT_TOKEN!) as IAuthPayload;
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
  await createRabbitMQConnection();
  const userChannel: Channel = (await createRabbitMQConnection()) as Channel;
  await consumeBuyerDirectMessage(userChannel);
  await consumeSellerDirectMessage(userChannel);
  // await consumeReviewFanoutMessages(userChannel);
  // await consumeSeedGigDirectMessages(userChannel);
};

const startElasticSearch = (): void => {
  checkElasticSearchConnection();
};

const usersErrorHandler = (app: Application): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
    log.error(`UsersService ${err.comingFrom}:`, err);

    if (err instanceof CustomError) {
      return res.status(err.statusCode).json(err.serializeErrors());
    }

    res.status(500).json({ message: 'Internal Server Error' });
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Users server has started with process is ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Users server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'UsersService startServer() method error:', error);
  }
};

export { start };
