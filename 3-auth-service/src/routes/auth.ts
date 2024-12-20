import express, { Router } from 'express';
import { create } from '@auth/controllers/signup';
import { login } from '@auth/controllers/signin';
import { verifyEmail } from '@auth/controllers/verifyEmail';
import { changePassword, forgotPassword, resetPassword } from '@auth/controllers/password';

const router: Router = express.Router();

export const authRoutes = (): Router => {
  router.post('/signup', create);
  router.post('/signin', login);
  router.put('/verify-email', verifyEmail);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
};
