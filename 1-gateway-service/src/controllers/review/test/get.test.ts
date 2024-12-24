/**
 * getReview.test.ts
 *
 * Tests the GetController from review/get.ts
 * Methods tested: reviewsByGigId, reviewsBySellerId
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetController } from '@gateway/controllers/review/get';
import { reviewService } from '@gateway/services/api/reviewService';
import {
  reviewMockRequest,
  reviewMockResponse,
  reviewMockData
} from '@gateway/controllers/review/test/mocks/review.mock';

import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';

jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/reviewService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('GetController', () => {
  let req: Request;
  let res: Response;
  let getController: GetController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = reviewMockResponse();
    getController = new GetController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reviewsByGigId method', () => {
    it('should return reviews for a given gig ID', async () => {
      req = reviewMockRequest({}, {}, null, { gigId: 'gigXYZ' }) as Request;
      jest.spyOn(reviewService, 'getReviewsByGigId').mockResolvedValue({
        data: {
          message: 'Reviews fetched',
          reviews: [ { ...reviewMockData }, { ...reviewMockData } ]
        }
      } as unknown as AxiosResponse);

      await getController.reviewsByGigId(req, res);
      expect(reviewService.getReviewsByGigId).toHaveBeenCalledWith('gigXYZ');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reviews fetched',
        reviews: [ { ...reviewMockData }, { ...reviewMockData } ]
      });
    });
  });

  describe('reviewsBySellerId method', () => {
    it('should return reviews for a given seller ID', async () => {
      req = reviewMockRequest({}, {}, null, { sellerId: 'sellerABC' }) as Request;
      jest.spyOn(reviewService, 'getReviewsBySellerId').mockResolvedValue({
        data: {
          message: 'Seller reviews fetched',
          reviews: [ { ...reviewMockData }, { ...reviewMockData } ]
        }
      } as unknown as AxiosResponse);

      await getController.reviewsBySellerId(req, res);
      expect(reviewService.getReviewsBySellerId).toHaveBeenCalledWith('sellerABC');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seller reviews fetched',
        reviews: [ { ...reviewMockData }, { ...reviewMockData } ]
      });
    });
  });
});
