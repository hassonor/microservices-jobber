import express, { Router } from 'express';
import { GetSellerController } from '@gateway/controllers/users/seller/get';
import { CreateSellerController } from '@gateway/controllers/users/seller/create';
import { UpdateSellerController } from '@gateway/controllers/users/seller/update';
import { SeedSellerController } from '@gateway/controllers/users/seller/seed';
import { authMiddleware } from '@gateway/services/authMiddleware';

class SellerRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/seller/id/:sellerId', authMiddleware.checkAuthentication, GetSellerController.prototype.id);
    this.router.get('/seller/username/username', authMiddleware.checkAuthentication, GetSellerController.prototype.username);
    this.router.get('/seller/random/:size', authMiddleware.checkAuthentication, GetSellerController.prototype.random);
    this.router.post('/seller/create', authMiddleware.checkAuthentication, CreateSellerController.prototype.create);
    this.router.put('/seller/:sellerId', authMiddleware.checkAuthentication, UpdateSellerController.prototype.update);
    this.router.put('/seller/seed/:count', authMiddleware.checkAuthentication, SeedSellerController.prototype.seed);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
