import express, { Router } from 'express';
import { authMiddleware } from '@gateway/services/authMiddleware';
import { SearchGigController } from '@gateway/controllers/gig/search';
import { CreateGigController } from '@gateway/controllers/gig/create';
import { UpdateGigController } from '@gateway/controllers/gig/update';
import { SeedGigController } from '@gateway/controllers/gig/seed';
import { GetGigController } from '@gateway/controllers/gig/get';
import { DeleteGigController } from '@gateway/controllers/gig/delete';

class GigRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/gig/:gigId', authMiddleware.checkAuthentication, GetGigController.prototype.gigById);
    this.router.get('/gig/seller/:sellerId', authMiddleware.checkAuthentication, GetGigController.prototype.getSellerGigs);
    this.router.get('/gig/seller/pause/:sellerId', authMiddleware.checkAuthentication, GetGigController.prototype.getSellerPausedGigs);
    this.router.get('/gig/search/:from/:size/:type', authMiddleware.checkAuthentication, SearchGigController.prototype.gigs);
    this.router.get('/gig/category/:username', authMiddleware.checkAuthentication, GetGigController.prototype.getGigsByCategory);
    this.router.get('/gig/top/:username', authMiddleware.checkAuthentication, GetGigController.prototype.getTopRatedGigsByCategory);
    this.router.get('/gig/similar/:gigId', authMiddleware.checkAuthentication, GetGigController.prototype.getMoreGigsLikeThis);
    this.router.post('/gig/create', authMiddleware.checkAuthentication, CreateGigController.prototype.gig);
    this.router.put('/gig/:gigId', authMiddleware.checkAuthentication, UpdateGigController.prototype.gig);
    this.router.put('/gig/active/:gigId', authMiddleware.checkAuthentication, UpdateGigController.prototype.gigActive);
    this.router.put('/gig/seed/:count', authMiddleware.checkAuthentication, SeedGigController.prototype.gig);
    this.router.delete('/gig/:gigId/:sellerId', authMiddleware.checkAuthentication, DeleteGigController.prototype.gig);
    return this.router;
  }
}

export const gigRoutes: GigRoutes = new GigRoutes();
