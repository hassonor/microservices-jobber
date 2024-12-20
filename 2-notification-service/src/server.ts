import http from 'http';
import 'express-async-errors';
import * as process from 'process';

import { CustomError, IErrorResponse, winstonLogger } from '@ohjobber/shared';
import { Logger } from 'winston';
import { notificationConfig } from '@notifications/config';
import { Application, Request, Response, NextFunction } from 'express';
import { appRoutes } from '@notifications/routes';
import { checkElasticSearchConnection } from '@notifications/elasticsearch';
import { Channel } from 'amqplib';
import { createRabbitMQConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/emailConsumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${notificationConfig.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export const start = (app: Application): void => {
  routesMiddleware(app);
  startElasticSearch();
  startQueues();
  notificationErrorHandler(app);
  startServer(app);
};

const startQueues = async (): Promise<void> => {
  const emailChannel = (await createRabbitMQConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
};

const startElasticSearch = (): void => {
  checkElasticSearchConnection();
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const notificationErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `AuthService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
};
