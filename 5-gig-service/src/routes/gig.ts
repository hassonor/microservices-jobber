import express, { Router } from 'express';
import { gigCreateController } from '@gig/controllers/create';
import { gigUpdateActiveController, gigUpdateController } from '@gig/controllers/update';
import { gigDeleteController } from '@gig/controllers/delete';
import {
  getSellerGigsController,
  getSellerInActiveGigsController,
  gigByIdController,
  gigsByCategoryController,
  moreLikeThisController,
  topRatedGigsByCategoryController
} from '@gig/controllers/get';
import { searchGigsController } from '@gig/controllers/search';
import { seedCreateGigController } from '@gig/controllers/seed';

const router: Router = express.Router();

const gigRoutes = (): Router => {
  router.get('/:gigId', gigByIdController);
  router.get('/seller/:sellerId', getSellerGigsController);
  router.get('/seller/pause/:sellerId', getSellerInActiveGigsController);
  router.get('/search/:from/:size/:type', searchGigsController);
  router.get('/category/:username', gigsByCategoryController);
  router.get('/top/:username', topRatedGigsByCategoryController);
  router.get('/similar/:gigId', moreLikeThisController);

  router.post('/create', gigCreateController);
  router.put('/:gigId', gigUpdateController);
  router.put('/active/:gigId', gigUpdateActiveController);
  router.put('/seed/:count', seedCreateGigController);
  router.delete('/:gigId/:sellerId', gigDeleteController);

  return router;
};

export { gigRoutes };
