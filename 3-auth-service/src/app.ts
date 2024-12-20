import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection } from '@auth/database';
import { authConfig } from '@auth/config';

const initialize = (): void => {
  authConfig.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
