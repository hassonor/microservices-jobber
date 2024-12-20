import { CreateController } from '@gateway/controllers/order/create';
import { GetController } from '@gateway/controllers/order/get';
import { UpdateController } from '@gateway/controllers/order/update';
import express, { Router } from 'express';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/order/notification/:userTo', GetController.prototype.notifications);
    this.router.get('/order/:orderId', GetController.prototype.orderId);
    this.router.get('/order/seller/:sellerId', GetController.prototype.sellerOrders);
    this.router.get('/order/buyer/:buyerId', GetController.prototype.buyerOrders);
    this.router.post('/order', CreateController.prototype.order);
    this.router.post('/order/create-payment-intent', CreateController.prototype.intent);
    this.router.put('/order/cancel/:orderId', UpdateController.prototype.cancel);
    this.router.put('/order/extension/:orderId', UpdateController.prototype.requestExtension);
    this.router.put('/order/deliver-order/:orderId', UpdateController.prototype.deliverOrder);
    this.router.put('/order/approve-order/:orderId', UpdateController.prototype.approveOrder);
    this.router.put('/order/gig/:type/:orderId', UpdateController.prototype.deliveryDate);
    this.router.put('/order/notification/mark-as-read', UpdateController.prototype.markNotificationAsRead);

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
