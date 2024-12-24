/**
 * getBuyer.test.ts
 *
 * Tests the GetBuyerController (email, currentUsername, username)
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetBuyerController } from '@gateway/controllers/users/buyer/get';
import { buyerService } from '@gateway/services/api/buyerService';
import {
  buyerMockRequest,
  buyerMockResponse,
  buyerMockData
} from '@gateway/controllers/users/buyer/test/mocks/buyer.mock';

// Additional mocks
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/buyerService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

// Mock the socketIO
Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('GetBuyerController', () => {
  let req: Request;
  let res: Response;
  let getBuyerController: GetBuyerController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = buyerMockResponse();
    getBuyerController = new GetBuyerController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('email method', () => {
    it('should return a buyer by email', async () => {
      jest.spyOn(buyerService, 'getBuyerByEmail').mockResolvedValue({
        data: {
          message: 'Buyer by email found',
          user: buyerMockData
        }
      } as unknown as AxiosResponse);

      await getBuyerController.email(req, res);
      expect(buyerService.getBuyerByEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer by email found',
        buyer: buyerMockData
      });
    });
  });

  describe('currentUsername method', () => {
    it('should return the current buyer by username', async () => {
      jest.spyOn(buyerService, 'getCurrentBuyerByUsername').mockResolvedValue({
        data: {
          message: 'Current buyer found',
          user: buyerMockData
        }
      } as unknown as AxiosResponse);

      await getBuyerController.currentUsername(req, res);
      expect(buyerService.getCurrentBuyerByUsername).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Current buyer found',
        buyer: buyerMockData
      });
    });
  });

  describe('username method', () => {
    it('should return a buyer by username', async () => {
      req = buyerMockRequest({}, {}, null, { username: 'buyerUser' }) as Request;

      jest.spyOn(buyerService, 'getBuyerByUsername').mockResolvedValue({
        data: {
          message: 'Buyer by username found',
          user: { ...buyerMockData, username: 'buyerUser' }
        }
      } as unknown as AxiosResponse);

      await getBuyerController.username(req, res);
      expect(buyerService.getBuyerByUsername).toHaveBeenCalledWith('buyerUser');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Buyer by username found',
        buyer: { ...buyerMockData, username: 'buyerUser' }
      });
    });
  });
});
