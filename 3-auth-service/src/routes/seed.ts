import express, { Router } from 'express';
import { createAuthUsers } from '@auth/controllers/seed';

const router: Router = express.Router();

export function seedRoutes(): Router {
  router.put('/seed/:count', createAuthUsers);

  return router;
}
