/**
 * seed.test.ts
 *
 * Tests the SeedSellerController (seed method)
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { SeedSellerController } from '@gateway/controllers/users/seller/seed';
import { sellerService } from '@gateway/services/api/sellerService';
import {
  sellerMockRequest,
  sellerMockResponse
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

describe('SeedSellerController', () => {
  let req: Request;
  let res: Response;
  let seedSellerController: SeedSellerController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = sellerMockResponse();
    seedSellerController = new SeedSellerController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seed method', () => {
    it('should seed sellers and return status 200', async () => {
      req = sellerMockRequest({}, {}, null, { count: '5' }) as Request;
      jest.spyOn(sellerService, 'seed').mockResolvedValue({
        data: {
          message: '5 sellers seeded successfully'
        }
      } as unknown as AxiosResponse);

      await seedSellerController.seed(req, res);
      expect(sellerService.seed).toHaveBeenCalledWith('5');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '5 sellers seeded successfully' });
    });
  });
});
