/**
 * seedGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { SeedGigController } from '@gateway/controllers/gig/seed';
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

describe('SeedGigController', () => {
  let req: Request;
  let res: Response;
  let seedGigController: SeedGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = gigMockRequest({}, {}, null, { count: '10' }) as Request;
    res = gigMockResponse();
    seedGigController = new SeedGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gig method', () => {
    it('should seed gigs and return status 200', async () => {
      jest.spyOn(gigService, 'seed').mockResolvedValue({
        data: {
          message: '10 gigs seeded successfully'
        }
      } as unknown as AxiosResponse);

      await seedGigController.gig(req, res);
      expect(gigService.seed).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '10 gigs seeded successfully'
      });
    });
  });
});
