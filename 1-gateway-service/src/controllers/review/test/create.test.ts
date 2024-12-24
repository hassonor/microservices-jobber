/**
 * createReview.test.ts
 *
 * Tests the CreateController from review/create.ts
 * Method tested: review
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { CreateController } from '@gateway/controllers/review/create';
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

// Mock socketIO
Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('CreateController', () => {
  let req: Request;
  let res: Response;
  let createController: CreateController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = reviewMockResponse();
    createController = new CreateController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('review method', () => {
    it('should create a new review and return status 201', async () => {
      req = reviewMockRequest({}, reviewMockData) as Request;
      jest.spyOn(reviewService, 'addReview').mockResolvedValue({
        data: {
          message: 'Review added successfully',
          review: { ...reviewMockData, _id: 'review123' }
        }
      } as unknown as AxiosResponse);

      await createController.review(req, res);

      expect(reviewService.addReview).toHaveBeenCalledWith(reviewMockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Review added successfully',
        review: { ...reviewMockData, _id: 'review123' }
      });
    });

    it('should handle error thrown by reviewService', async () => {
      req = reviewMockRequest({}, reviewMockData) as Request;
      jest.spyOn(reviewService, 'addReview').mockRejectedValue(new Error('Service Error'));

      await expect(createController.review(req, res)).rejects.toThrow('Service Error');
    });
  });
});
