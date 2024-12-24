/**
 * create.test.ts
 *
 * Tests the CreateSellerController (create method)
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { CreateSellerController } from '@gateway/controllers/users/seller/create';
import { sellerService } from '@gateway/services/api/sellerService';
import {
  sellerMockRequest,
  sellerMockResponse,
  sellerMockData
} from '@gateway/controllers/users/seller/test/mocks/seller.mock';

// Additional mocks
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/sellerService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('CreateSellerController', () => {
  let req: Request;
  let res: Response;
  let createSellerController: CreateSellerController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = sellerMockResponse();
    createSellerController = new CreateSellerController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should create a new seller and return status 201', async () => {
      req = sellerMockRequest({}, sellerMockData) as Request;

      jest.spyOn(sellerService, 'createSeller').mockResolvedValue({
        data: {
          message: 'Seller created successfully',
          seller: { ...sellerMockData, _id: 'seller123' }
        }
      } as unknown as AxiosResponse);

      await createSellerController.create(req, res);
      expect(sellerService.createSeller).toHaveBeenCalledWith(sellerMockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller created successfully',
        seller: { ...sellerMockData, _id: 'seller123' }
      });
    });
  });
});
