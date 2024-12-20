import express, { Router } from 'express';
import { createSellerController } from '@users/controllers/seller/create';
import { updateSellerController } from '@users/controllers/seller/update';
import { getById, getByUsername, getRandom } from '@users/controllers/seller/get';
import { seedSeller } from '@users/controllers/seller/seed';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', getById);
  router.get('/username/:username', getByUsername);
  router.get('/random/:size', getRandom);
  router.post('/create', createSellerController);
  router.put('/:sellerId', updateSellerController);
  router.put('/seed/:count', seedSeller);

  return router;
};

export { sellerRoutes };
