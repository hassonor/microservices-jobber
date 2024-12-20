import express, { Router } from 'express';
import { CurrentUserController } from '@gateway/controllers/auth/currentUser';
import { authMiddleware } from '@gateway/services/authMiddleware';
import { RefreshTokenController } from '@gateway/controllers/auth/refreshToken';

class CurrentUserRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/refresh-token/:username', authMiddleware.checkAuthentication, RefreshTokenController.prototype.refreshToken);
    this.router.get('/auth/current-user', authMiddleware.checkAuthentication, CurrentUserController.prototype.getCurrentUser);
    this.router.get('/auth/logged-in-user', authMiddleware.checkAuthentication, CurrentUserController.prototype.getLoggedInUsers);
    this.router.delete(
      '/auth/logged-in-user/:username',
      authMiddleware.checkAuthentication,
      CurrentUserController.prototype.removeLoggedInUser
    );
    this.router.post('/auth/resend-email', authMiddleware.checkAuthentication, CurrentUserController.prototype.resendEmail);

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
