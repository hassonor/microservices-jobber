/**
 * updateOrder.test.ts
 *
 * Tests the UpdateController from order/update.ts
 * Methods tested: cancel, requestExtension, deliveryDate, deliverOrder,
 *                 approveOrder, markNotificationAsRead
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { UpdateController } from '@gateway/controllers/order/update';
import { orderService } from '@gateway/services/api/orderService';
import {
  orderMockRequest,
  orderMockResponse,
  orderMockData
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

describe('UpdateController', () => {
  let req: Request;
  let res: Response;
  let updateController: UpdateController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = orderMockResponse();
    updateController = new UpdateController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cancel method', () => {
    it('should cancel an order and return status 201', async () => {
      req = orderMockRequest(
        {},
        { paymentIntentId: 'intentXYZ', orderData: 'Some data' },
        null,
        { orderId: 'orderABC' }
      ) as Request;

      jest.spyOn(orderService, 'cancelOrder').mockResolvedValue({
        data: { message: 'Order canceled' }
      } as unknown as AxiosResponse);

      await updateController.cancel(req, res);
      expect(orderService.cancelOrder).toHaveBeenCalledWith('intentXYZ', 'orderABC', 'Some data');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order canceled' });
    });
  });

  describe('requestExtension method', () => {
    it('should request a new delivery date extension', async () => {
      req = orderMockRequest(
        {},
        { reason: 'Need a few more days' },
        null,
        { orderId: 'orderABC' }
      ) as Request;

      jest.spyOn(orderService, 'requestDeliveryDateExtension').mockResolvedValue({
        data: {
          message: 'Extension requested',
          order: { ...orderMockData, status: 'ExtensionRequested' }
        }
      } as unknown as AxiosResponse);

      await updateController.requestExtension(req, res);
      expect(orderService.requestDeliveryDateExtension).toHaveBeenCalledWith('orderABC', {
        reason: 'Need a few more days'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Extension requested',
        order: { ...orderMockData, status: 'ExtensionRequested' }
      });
    });
  });

  describe('deliveryDate method', () => {
    it('should update the delivery date and return status 200', async () => {
      req = orderMockRequest(
        {},
        { newDate: '2025-05-01' },
        null,
        { orderId: 'orderABC', type: 'RESCHEDULE' }
      ) as Request;

      jest.spyOn(orderService, 'updateDeliveryDate').mockResolvedValue({
        data: {
          message: 'Delivery date updated',
          order: { orderId: 'orderABC', newDate: '2025-05-01' }
        }
      } as unknown as AxiosResponse);

      await updateController.deliveryDate(req, res);
      expect(orderService.updateDeliveryDate).toHaveBeenCalledWith('orderABC', 'RESCHEDULE', {
        newDate: '2025-05-01'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Delivery date updated',
        order: { orderId: 'orderABC', newDate: '2025-05-01' }
      });
    });
  });

  describe('deliverOrder method', () => {
    it('should deliver the order and return status 200', async () => {
      req = orderMockRequest(
        {},
        { files: ['design.png'] },
        null,
        { orderId: 'orderABC' }
      ) as Request;

      jest.spyOn(orderService, 'deliverOrder').mockResolvedValue({
        data: {
          message: 'Order delivered',
          order: { orderId: 'orderABC', delivered: true }
        }
      } as unknown as AxiosResponse);

      await updateController.deliverOrder(req, res);
      expect(orderService.deliverOrder).toHaveBeenCalledWith('orderABC', { files: ['design.png'] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order delivered',
        order: { orderId: 'orderABC', delivered: true }
      });
    });
  });

  describe('approveOrder method', () => {
    it('should approve the order and return status 200', async () => {
      req = orderMockRequest(
        {},
        { rating: 5 },
        null,
        { orderId: 'orderABC' }
      ) as Request;

      jest.spyOn(orderService, 'approveOrder').mockResolvedValue({
        data: {
          message: 'Order approved',
          order: { orderId: 'orderABC', approved: true }
        }
      } as unknown as AxiosResponse);

      await updateController.approveOrder(req, res);
      expect(orderService.approveOrder).toHaveBeenCalledWith('orderABC', { rating: 5 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order approved',
        order: { orderId: 'orderABC', approved: true }
      });
    });
  });

  describe('markNotificationAsRead method', () => {
    it('should mark notification as read and return status 200', async () => {
      req = orderMockRequest(
        {},
        { notificationId: 'notifXYZ' }
      ) as Request;

      jest.spyOn(orderService, 'markNotificationAsRead').mockResolvedValue({
        data: {
          message: 'Notification marked as read',
          notification: { _id: 'notifXYZ', isRead: true }
        }
      } as unknown as AxiosResponse);

      await updateController.markNotificationAsRead(req, res);
      expect(orderService.markNotificationAsRead).toHaveBeenCalledWith('notifXYZ');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Notification marked as read',
        notification: { _id: 'notifXYZ', isRead: true }
      });
    });
  });
});
