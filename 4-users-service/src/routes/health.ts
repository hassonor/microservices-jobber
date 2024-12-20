import express, { Router } from 'express';
import { health } from '@users/controllers/health';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/user-health', health);

  return router;
};

export { healthRoutes };
