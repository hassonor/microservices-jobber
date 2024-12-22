/**
 * search.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { SearchController } from '@gateway/controllers/auth/search';
import { authMockRequest, authMockResponse } from '@gateway/controllers/auth/test/mocks/auth.mock';
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/authService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('SearchController', () => {
  let req: Request;
  let res: Response;
  let searchController: SearchController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, {}, null) as Request;
    res = authMockResponse();
    searchController = new SearchController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gigById method', () => {
    it('should return gig by ID', async () => {
      req.params = { gigId: 'gig123' };

      jest.spyOn(authService, 'getGig').mockResolvedValue({
        data: {
          message: 'Gig found',
          gig: { id: 'gig123', title: 'Test Gig' }
        }
      } as unknown as AxiosResponse);

      await searchController.gigById(req, res);
      expect(authService.getGig).toHaveBeenCalledWith('gig123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig found',
        gig: { id: 'gig123', title: 'Test Gig' }
      });
    });
  });

  describe('gigs method', () => {
    it('should return all gigs based on query', async () => {
      req.params = { from: '0', size: '10', type: 'all' };
      req.query = { category: 'design', sort: 'desc' };

      jest.spyOn(authService, 'getGigs').mockResolvedValue({
        data: {
          message: 'Gigs fetched',
          total: 2,
          gigs: [
            { id: 'gig1', title: 'Design Logo' },
            { id: 'gig2', title: 'Illustration' }
          ]
        }
      } as unknown as AxiosResponse);

      await searchController.gigs(req, res);
      // 'category=design&sort=desc' => constructed query
      expect(authService.getGigs).toHaveBeenCalledWith('category=design&sort=desc', '0', '10', 'all');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gigs fetched',
        total: 2,
        gigs: [
          { id: 'gig1', title: 'Design Logo' },
          { id: 'gig2', title: 'Illustration' }
        ]
      });
    });
  });
});
