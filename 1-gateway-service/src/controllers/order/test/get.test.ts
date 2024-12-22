/**
 * getOrder.test.ts
 *
 * Tests the GetController from order/get.ts
 * Methods tested: orderId, sellerOrders, buyerOrders, notifications
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetController } from '@gateway/controllers/order/get';
import { orderService } from '@gateway/services/api/orderService';
import {
  orderMockRequest,
  orderMockResponse,

} from '@gateway/controllers/order/test/mocks/order.mock';

// Additional mocks
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/orderService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('GetController', () => {
  let req: Request;
  let res: Response;
  let getController: GetController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = orderMockResponse();
    getController = new GetController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('orderId method', () => {
    it('should return an order by ID', async () => {
      req = orderMockRequest({}, {}, null, { orderId: 'orderABC' }) as Request;

      jest.spyOn(orderService, 'getOrderById').mockResolvedValue({
        data: {
          message: 'Order found',
          order: { orderId: 'orderABC', price: 250 }
        }
      } as unknown as AxiosResponse);

      await getController.orderId(req, res);
      expect(orderService.getOrderById).toHaveBeenCalledWith('orderABC');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order found',
        order: { orderId: 'orderABC', price: 250 }
      });
    });
  });

  describe('sellerOrders method', () => {
    it('should return orders for a seller', async () => {
      req = orderMockRequest({}, {}, null, { sellerId: 'seller789' }) as Request;

      jest.spyOn(orderService, 'sellerOrders').mockResolvedValue({
        data: {
          message: 'Seller orders found',
          orders: [{ orderId: 'order001' }, { orderId: 'order002' }]
        }
      } as unknown as AxiosResponse);

      await getController.sellerOrders(req, res);
      expect(orderService.sellerOrders).toHaveBeenCalledWith('seller789');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller orders found',
        orders: [{ orderId: 'order001' }, { orderId: 'order002' }]
      });
    });
  });

  describe('buyerOrders method', () => {
    it('should return orders for a buyer', async () => {
      req = orderMockRequest({}, {}, null, { buyerId: 'buyer123' }) as Request;

      jest.spyOn(orderService, 'buyerOrders').mockResolvedValue({
        data: {
          message: 'Buyer orders found',
          orders: [{ orderId: 'order010' }, { orderId: 'order011' }]
        }
      } as unknown as AxiosResponse);

      await getController.buyerOrders(req, res);
      expect(orderService.buyerOrders).toHaveBeenCalledWith('buyer123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer orders found',
        orders: [{ orderId: 'order010' }, { orderId: 'order011' }]
      });
    });
  });

  describe('notifications method', () => {
    it('should return notifications for a user', async () => {
      req = orderMockRequest({}, {}, null, { userTo: 'buyer123' }) as Request;

      jest.spyOn(orderService, 'getNotifications').mockResolvedValue({
        data: {
          message: 'Notifications fetched',
          notifications: [{ _id: 'notif101' }, { _id: 'notif102' }]
        }
      } as unknown as AxiosResponse);

      await getController.notifications(req, res);
      expect(orderService.getNotifications).toHaveBeenCalledWith('buyer123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Notifications fetched',
        notifications: [{ _id: 'notif101' }, { _id: 'notif102' }]
      });
    });
  });
});
