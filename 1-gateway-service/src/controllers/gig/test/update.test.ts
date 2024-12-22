/**
 * updateGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { UpdateGigController } from '@gateway/controllers/gig/update';
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

describe('UpdateGigController', () => {
  let req: Request;
  let res: Response;
  let updateGigController: UpdateGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = gigMockResponse();
    updateGigController = new UpdateGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gig method', () => {
    it('should update a gig and return status 200', async () => {
      req = gigMockRequest(
        {},
        { title: 'Updated Title' },
        null,
        { gigId: 'abc123' }
      ) as Request;

      jest.spyOn(gigService, 'updateGig').mockResolvedValue({
        data: {
          message: 'Gig updated successfully',
          gig: { ...gigMockData, title: 'Updated Title' }
        }
      } as unknown as AxiosResponse);

      await updateGigController.gig(req, res);
      expect(gigService.updateGig).toHaveBeenCalledWith('abc123', { title: 'Updated Title' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig updated successfully',
        gig: { ...gigMockData, title: 'Updated Title' }
      });
    });
  });

  describe('gigActive method', () => {
    it('should update gig active property and return status 200', async () => {
      req = gigMockRequest(
        {},
        { active: true },
        null,
        { gigId: 'abc123' }
      ) as Request;

      jest.spyOn(gigService, 'updateActiveGigProp').mockResolvedValue({
        data: {
          message: 'Gig active property updated',
          gig: { ...gigMockData, active: true }
        }
      } as unknown as AxiosResponse);

      await updateGigController.gigActive(req, res);
      expect(gigService.updateActiveGigProp).toHaveBeenCalledWith('abc123', true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig active property updated',
        gig: { ...gigMockData, active: true }
      });
    });
  });
});
