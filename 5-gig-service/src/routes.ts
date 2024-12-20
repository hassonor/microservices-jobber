import { Application } from 'express';
import { healthRoutes } from '@gig/routes/health';
import { verifyGatewayRequest } from '@ohjobber/shared';
import { gigRoutes } from '@gig/routes/gig';

const BASE_PATH = '/api/v1/gig';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, gigRoutes());
};

export { appRoutes };
