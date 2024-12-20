import express, { Router } from 'express';
import { health } from '@notifications/controllers/health';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/notification-health', health);

  return router;
}
