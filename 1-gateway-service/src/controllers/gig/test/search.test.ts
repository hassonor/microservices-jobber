/**
 * searchGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { SearchGigController } from '@gateway/controllers/gig/search';
import { gigService } from '@gateway/services/api/gigService';
import {
  gigMockRequest,
  gigMockResponse,
  gigMockData
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

describe('SearchGigController', () => {
  let req: Request;
  let res: Response;
  let searchGigController: SearchGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = gigMockResponse();
    searchGigController = new SearchGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gigs method', () => {
    it('should search gigs with correct query and return status 200', async () => {
      req = gigMockRequest({}, {}, null, { from: '0', size: '10', type: 'all' }) as Request;
      req.query = { category: 'design', sort: 'desc' };

      jest.spyOn(gigService, 'searchGigs').mockResolvedValue({
        data: {
          message: 'Gigs fetched',
          total: 2,
          gigs: [gigMockData, gigMockData]
        }
      } as unknown as AxiosResponse);

      await searchGigController.gigs(req, res);
      expect(gigService.searchGigs).toHaveBeenCalledWith('category=design&sort=desc', '0', '10', 'all');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gigs fetched',
        total: 2,
        gigs: [gigMockData, gigMockData]
      });
    });
  });
});
