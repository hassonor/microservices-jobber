import express, { Router } from 'express';
import { SignUpController } from '@gateway/controllers/auth/signup';
import { SignInController } from '@gateway/controllers/auth/signin';
import { VerifyEmailController } from '@gateway/controllers/auth/verifyEmail';
import { PasswordController } from '@gateway/controllers/auth/password';
import { AuthSeedController } from '@gateway/controllers/auth/seed';

class AuthRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', SignUpController.prototype.create);
    this.router.post('/auth/signin', SignInController.prototype.login);
    this.router.put('/auth/verify-email', VerifyEmailController.prototype.update);
    this.router.put('/auth/forgot-password', PasswordController.prototype.forgotPassword);
    this.router.put('/auth/reset-password/:token', PasswordController.prototype.resetPassword);
    this.router.put('/auth/change-password', PasswordController.prototype.changePassword);
    this.router.put('/auth/seed/:count', AuthSeedController.prototype.createAuthUsers);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
