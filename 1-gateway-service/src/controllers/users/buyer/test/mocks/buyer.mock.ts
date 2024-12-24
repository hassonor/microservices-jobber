/**
 * buyer.mock.ts
 *
 * Contains mock interfaces and data for testing the Buyer controllers.
 */

import { Response } from 'express';
import { IBuyerDocument } from '@ohjobber/shared';

/**
 * Extend IBuyerDocument with partial fields so that your tests
 * can pass any needed fields without TypeScript errors.
 */
export interface IBuyerMockData extends Partial<IBuyerDocument> {
  // If your tests pass any additional custom fields, add them here, e.g.:
  extraField?: string;
}

/**
 * Basic JWT interface for mocking session data
 */
export interface IJWT {
  jwt?: string;
}

/**
 * Example Buyer mock data
 */
export const buyerMockData: IBuyerMockData = {
  _id: 'buyer123',
  username: 'buyerUser',
  email: 'buyer@example.com',
  profilePicture: 'buyerPic.png',
  country: 'USA',
  isSeller: false,
  purchasedGigs: ['gig1', 'gig2']
};

/**
 * Build a mock Request object
 */
export const buyerMockRequest = (
  sessionData: IJWT = {},
  body: Partial<IBuyerMockData> = {},
  currentUser: unknown = null,
  params: Record<string, any> = {}
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

/**
 * Build a mock Response object with .status() and .json() spied
 */
export const buyerMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
