/**
 * review.mock.ts
 *
 * Contains mock interfaces and data for testing the Review controllers.
 */

import { Response } from 'express';
import { IReviewDocument } from '@ohjobber/shared';

export interface IReviewMockData extends Partial<IReviewDocument> {
  // Extend with any additional fields your tests might pass
}

export interface IJWT {
  jwt?: string;
}

/**
 * Example mock data that can be used in your tests.
 */
export const reviewMockData: IReviewMockData = {
  gigId: 'gigXYZ',
  reviewerId: 'reviewer123',
  sellerId: 'sellerABC',
  review: 'Excellent work! Very happy with the result.',
  reviewerImage: 'reviewer_img.png',
  rating: 5,
  orderId: 'order999',
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  reviewerUsername: 'john_doe',
  country: 'USA',
  reviewType: 'gig'
};

/**
 * Mocks an Express Request object.
 */
export const reviewMockRequest = (
  sessionData: IJWT = {},
  body: Partial<IReviewMockData> = {},
  currentUser: unknown = null,
  params: Record<string, any> = {}
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

/**
 * Mocks an Express Response object with jest spies for .status() and .json().
 */
export const reviewMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
