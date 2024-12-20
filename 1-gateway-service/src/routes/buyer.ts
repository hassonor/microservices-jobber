import express, { Router } from 'express';
import { GetBuyerController } from '@gateway/controllers/users/buyer/get';
import { authMiddleware } from '@gateway/services/authMiddleware';

class BuyerRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/buyer/email', authMiddleware.checkAuthentication, GetBuyerController.prototype.email);
    this.router.get('/buyer/username', authMiddleware.checkAuthentication, GetBuyerController.prototype.currentUsername);
    this.router.get('/buyer/:username', authMiddleware.checkAuthentication, GetBuyerController.prototype.username);

    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
