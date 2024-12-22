/**
 * deleteGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { DeleteGigController } from '@gateway/controllers/gig/delete';
import { gigService } from '@gateway/services/api/gigService';
import {
  gigMockRequest,
  gigMockResponse
} from '@gateway/controllers/gig/test/mocks/gig.mock';
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/gigService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('DeleteGigController', () => {
  let req: Request;
  let res: Response;
  let deleteGigController: DeleteGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = gigMockRequest({}, {}, null, {
      gigId: 'abc123',
      sellerId: 'seller123'
    }) as Request;
    res = gigMockResponse();
    deleteGigController = new DeleteGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gig method', () => {
    it('should delete a gig and return status 200', async () => {
      jest.spyOn(gigService, 'deleteGig').mockResolvedValue({
        data: {
          message: 'Gig deleted successfully'
        }
      } as unknown as AxiosResponse);

      await deleteGigController.gig(req, res);
      expect(gigService.deleteGig).toHaveBeenCalledWith('abc123', 'seller123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig deleted successfully'
      });
    });
  });
});
