/**
 * update.test.ts
 *
 * Tests the UpdateSellerController (update method)
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { UpdateSellerController } from '@gateway/controllers/users/seller/update';
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

describe('UpdateSellerController', () => {
  let req: Request;
  let res: Response;
  let updateSellerController: UpdateSellerController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = sellerMockResponse();
    updateSellerController = new UpdateSellerController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update method', () => {
    it('should update a seller and return status 200', async () => {
      req = sellerMockRequest({}, { fullName: 'Jane Seller Updated' }, null, { sellerId: 'seller123' }) as Request;
      jest.spyOn(sellerService, 'updateSeller').mockResolvedValue({
        data: {
          message: 'Seller updated successfully',
          seller: { ...sellerMockData, fullName: 'Jane Seller Updated' }
        }
      } as unknown as AxiosResponse);

      await updateSellerController.update(req, res);
      expect(sellerService.updateSeller).toHaveBeenCalledWith('seller123', { fullName: 'Jane Seller Updated' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller updated successfully',
        seller: { ...sellerMockData, fullName: 'Jane Seller Updated' }
      });
    });
  });
});
