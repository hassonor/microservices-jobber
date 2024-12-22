/**
 * createGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { CreateGigController } from '@gateway/controllers/gig/create';
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

describe('CreateGigController', () => {
  let req: Request;
  let res: Response;
  let createGigController: CreateGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = gigMockRequest({}, gigMockData) as Request;
    res = gigMockResponse();
    createGigController = new CreateGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gig method', () => {
    it('should create a gig and return status 201', async () => {
      jest.spyOn(gigService, 'createGig').mockResolvedValue({
        data: {
          message: 'Gig created successfully',
          gig: gigMockData
        }
      } as unknown as AxiosResponse);

      await createGigController.gig(req, res);
      expect(gigService.createGig).toHaveBeenCalledWith(gigMockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig created successfully',
        gig: gigMockData
      });
    });
  });
});
