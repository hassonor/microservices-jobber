import { databaseConnection } from '@order/database';
import { orderConfig } from '@order/config';
import express, { Express } from 'express';
import { start } from '@order/server';

const initialize = (): void => {
  orderConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
