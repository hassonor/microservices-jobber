import { databaseConnection } from '@users/database';
import { usersConfig } from '@users/config';
import express, { Express } from 'express';
import { start } from '@users/server';

const initialize = (): void => {
  usersConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
