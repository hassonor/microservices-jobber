/**
 * createOrder.test.ts
 *
 * Tests the CreateController from order/create.ts
 * Methods tested: intent, order
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { CreateController } from '@gateway/controllers/order/create';
import { orderService } from '@gateway/services/api/orderService';
import {
  orderMockRequest,
  orderMockResponse,
  orderMockData
} from '@gateway/controllers/order/test/mocks/order.mock';

// Additional mocks for external modules
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/orderService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

// Mock socket.io
Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('CreateController', () => {
  let req: Request;
  let res: Response;
  let createController: CreateController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = orderMockResponse();
    createController = new CreateController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intent method', () => {
    it('should create a payment intent and return status 201', async () => {
      req = orderMockRequest({}, { price: 500, buyerId: 'buyerXYZ' }) as Request;

      jest.spyOn(orderService, 'createOrderIntent').mockResolvedValue({
        data: {
          message: 'Payment intent created',
          clientSecret: 'secret_abc123',
          paymentIntentId: 'intent_789'
        }
      } as unknown as AxiosResponse);

      await createController.intent(req, res);
      expect(orderService.createOrderIntent).toHaveBeenCalledWith(500, 'buyerXYZ');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Payment intent created',
        clientSecret: 'secret_abc123',
        paymentIntentId: 'intent_789'
      });
    });

    it('should handle error thrown by orderService', async () => {
      req = orderMockRequest({}, { price: 500, buyerId: 'buyerXYZ' }) as Request;
      jest.spyOn(orderService, 'createOrderIntent').mockRejectedValue(new Error('Service Error'));

      // If using express-async-errors, it should bubble up
      await expect(createController.intent(req, res)).rejects.toThrow('Service Error');
    });
  });

  describe('order method', () => {
    it('should create an order and return status 201', async () => {
      req = orderMockRequest({}, orderMockData) as Request;

      jest.spyOn(orderService, 'createOrder').mockResolvedValue({
        data: {
          message: 'Order created',
          order: { orderId: 'orderABC', price: 250 }
        }
      } as unknown as AxiosResponse);

      await createController.order(req, res);
      expect(orderService.createOrder).toHaveBeenCalledWith(orderMockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order created',
        order: { orderId: 'orderABC', price: 250 }
      });
    });
  });
});
