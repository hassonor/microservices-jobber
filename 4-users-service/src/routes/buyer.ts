import express, { Router } from 'express';
import { buyerByCurrentUsername, buyerByEmail, buyerByUsername } from '@users/controllers/buyer/get';

const router: Router = express.Router();

const buyerRoutes = (): Router => {
  router.get('/email', buyerByEmail);
  router.get('/username', buyerByCurrentUsername);
  router.get('/:username', buyerByUsername);

  return router;
};

export { buyerRoutes };
