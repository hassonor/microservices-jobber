import express, { Router } from 'express';
import { getCurrentUser, resendEmail } from '@auth/controllers/currentUser';
import { refreshToken } from '@auth/controllers/refreshToken';

const router: Router = express.Router();

export const currentUserRoutes = (): Router => {
  router.get('/refresh-token/:username', refreshToken);
  router.get('/current-user', getCurrentUser);
  router.post('/resend-email', resendEmail);

  return router;
};
