import { databaseConnection } from '@chat/database';
import { chatConfig } from '@chat/config';
import express, { Express } from 'express';
import { start } from '@chat/server';

const initialize = (): void => {
  chatConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
