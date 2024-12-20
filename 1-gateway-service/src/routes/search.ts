import express, { Router } from 'express';
import { SearchController } from '@gateway/controllers/auth/search';

class SearchRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/search/gig/:from/:size/:type', SearchController.prototype.gigs);
    this.router.get('/auth/search/gig/:gigId', SearchController.prototype.gigById);

    return this.router;
  }
}

export const searchRoutes: SearchRoutes = new SearchRoutes();
