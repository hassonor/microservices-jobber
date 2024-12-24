/**
 * get.test.ts
 *
 * Tests the GetSellerController (id, username, random)
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetSellerController } from '@gateway/controllers/users/seller/get';
import { sellerService } from '@gateway/services/api/sellerService';
import {
  sellerMockRequest,
  sellerMockResponse,
  sellerMockData
} from '@gateway/controllers/users/seller/test/mocks/seller.mock';


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

describe('GetSellerController', () => {
  let req: Request;
  let res: Response;
  let getSellerController: GetSellerController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = sellerMockResponse();
    getSellerController = new GetSellerController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('id method', () => {
    it('should return a seller by ID', async () => {
      req = sellerMockRequest({}, {}, null, { sellerId: 'seller123' }) as Request;
      jest.spyOn(sellerService, 'getSellerById').mockResolvedValue({
        data: {
          message: 'Seller found by ID',
          seller: { ...sellerMockData, _id: 'seller123' }
        }
      } as unknown as AxiosResponse);

      await getSellerController.id(req, res);
      expect(sellerService.getSellerById).toHaveBeenCalledWith('seller123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller found by ID',
        seller: { ...sellerMockData, _id: 'seller123' }
      });
    });
  });

  describe('username method', () => {
    it('should return a seller by username', async () => {
      req = sellerMockRequest({}, {}, null, { username: 'sellerUser' }) as Request;
      jest.spyOn(sellerService, 'getSellerByUsername').mockResolvedValue({
        data: {
          message: 'Seller found by username',
          seller: { ...sellerMockData, username: 'sellerUser' }
        }
      } as unknown as AxiosResponse);

      await getSellerController.username(req, res);
      expect(sellerService.getSellerByUsername).toHaveBeenCalledWith('sellerUser');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller found by username',
        seller: { ...sellerMockData, username: 'sellerUser' }
      });
    });
  });

  describe('random method', () => {
    it('should return random sellers', async () => {
      req = sellerMockRequest({}, {}, null, { size: '3' }) as Request;
      jest.spyOn(sellerService, 'getRandomSellers').mockResolvedValue({
        data: {
          message: 'Random sellers fetched',
          sellers: [
            { ...sellerMockData, username: 'randomSeller1' },
            { ...sellerMockData, username: 'randomSeller2' },
            { ...sellerMockData, username: 'randomSeller3' }
          ]
        }
      } as unknown as AxiosResponse);

      await getSellerController.random(req, res);
      expect(sellerService.getRandomSellers).toHaveBeenCalledWith(3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Random sellers fetched',
        sellers: [
          { ...sellerMockData, username: 'randomSeller1' },
          { ...sellerMockData, username: 'randomSeller2' },
          { ...sellerMockData, username: 'randomSeller3' }
        ]
      });
    });
  });
});
