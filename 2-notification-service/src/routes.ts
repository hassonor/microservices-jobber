import { Application } from 'express';
import { healthRoutes } from '@notifications/routes/health';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
};
