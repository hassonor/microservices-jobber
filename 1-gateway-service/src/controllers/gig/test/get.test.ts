/**
 * getGig.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetGigController } from '@gateway/controllers/gig/get';
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

describe('GetGigController', () => {
  let req: Request;
  let res: Response;
  let getGigController: GetGigController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = gigMockResponse();
    getGigController = new GetGigController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gigById method', () => {
    it('should return gig by ID', async () => {
      req = gigMockRequest({}, {}, null, { gigId: 'abc123' }) as Request;
      jest.spyOn(gigService, 'getGigById').mockResolvedValue({
        data: {
          message: 'Gig found',
          gig: gigMockData
        }
      } as unknown as AxiosResponse);

      await getGigController.gigById(req, res);
      expect(gigService.getGigById).toHaveBeenCalledWith('abc123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig found',
        gig: gigMockData
      });
    });
  });

  describe('getSellerGigs method', () => {
    it('should return gigs from a seller', async () => {
      req = gigMockRequest({}, {}, null, { sellerId: 'seller123' }) as Request;
      jest.spyOn(gigService, 'getSellerGigs').mockResolvedValue({
        data: {
          message: 'Seller gigs found',
          gigs: [gigMockData]
        }
      } as unknown as AxiosResponse);

      await getGigController.getSellerGigs(req, res);
      expect(gigService.getSellerGigs).toHaveBeenCalledWith('seller123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller gigs found',
        gigs: [gigMockData]
      });
    });
  });

  describe('getSellerPausedGigs method', () => {
    it('should return paused gigs from a seller', async () => {
      req = gigMockRequest({}, {}, null, { sellerId: 'seller123' }) as Request;
      jest.spyOn(gigService, 'getSellerPausedGigs').mockResolvedValue({
        data: {
          message: 'Seller paused gigs found',
          gigs: [gigMockData]
        }
      } as unknown as AxiosResponse);

      await getGigController.getSellerPausedGigs(req, res);
      expect(gigService.getSellerPausedGigs).toHaveBeenCalledWith('seller123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller paused gigs found',
        gigs: [gigMockData]
      });
    });
  });

  describe('getGigsByCategory method', () => {
    it('should return gigs by category (username)', async () => {
      req = gigMockRequest({}, {}, null, { username: 'someCategory' }) as Request;
      jest.spyOn(gigService, 'getGigsByCategory').mockResolvedValue({
        data: {
          message: 'Category gigs',
          gigs: [gigMockData]
        }
      } as unknown as AxiosResponse);

      await getGigController.getGigsByCategory(req, res);
      expect(gigService.getGigsByCategory).toHaveBeenCalledWith('someCategory');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Category gigs',
        gigs: [gigMockData]
      });
    });
  });

  describe('getMoreGigsLikeThis method', () => {
    it('should return similar gigs', async () => {
      req = gigMockRequest({}, {}, null, { gigId: 'abc123' }) as Request;
      jest.spyOn(gigService, 'getMoreGigsLikeThis').mockResolvedValue({
        data: {
          message: 'Similar gigs found',
          gigs: [gigMockData]
        }
      } as unknown as AxiosResponse);

      await getGigController.getMoreGigsLikeThis(req, res);
      expect(gigService.getMoreGigsLikeThis).toHaveBeenCalledWith('abc123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Similar gigs found',
        gigs: [gigMockData]
      });
    });
  });

  describe('getTopRatedGigsByCategory method', () => {
    it('should return top-rated gigs for a category (username)', async () => {
      req = gigMockRequest({}, {}, null, { username: 'someCategory' }) as Request;
      jest.spyOn(gigService, 'getTopRatedGigsByCategory').mockResolvedValue({
        data: {
          message: 'Top-rated category gigs found',
          gigs: [gigMockData]
        }
      } as unknown as AxiosResponse);

      await getGigController.getTopRatedGigsByCategory(req, res);
      expect(gigService.getTopRatedGigsByCategory).toHaveBeenCalledWith('someCategory');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Top-rated category gigs found',
        gigs: [gigMockData]
      });
    });
  });
});
