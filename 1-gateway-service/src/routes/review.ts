import { CreateController } from '@gateway/controllers/review/create';
import { GetController } from '@gateway/controllers/review/get';
import { authMiddleware } from '@gateway/services/authMiddleware';
import express, { Router } from 'express';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/review/gig/:gigId', authMiddleware.checkAuthentication, GetController.prototype.reviewsByGigId);
    this.router.get('/review/seller/:sellerId', authMiddleware.checkAuthentication, GetController.prototype.reviewsBySellerId);
    this.router.post('/review', authMiddleware.checkAuthentication, CreateController.prototype.review);
    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();
