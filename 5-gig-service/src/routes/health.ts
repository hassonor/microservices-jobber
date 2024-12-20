import express, { Router } from 'express';
import { healthController } from '@gig/controllers/health';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/gig-health', healthController);

  return router;
};

export { healthRoutes };
