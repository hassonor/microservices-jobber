/**
 * seller.mock.ts
 *
 * Contains mock interfaces and data for testing the Seller controllers.
 */

import { Response } from 'express';
import { ISellerDocument } from '@ohjobber/shared';

export interface ISellerMockData extends Partial<ISellerDocument> {
  // If your tests pass additional fields, add them here:
  extraField?: string;
}

export interface IJWT {
  jwt?: string;
}

/**
 * Example seller mock data
 */
export const sellerMockData: ISellerMockData = {
  _id: 'seller123',
  username: 'sellerUser',
  email: 'seller@example.com',
  profilePicture: 'sellerPic.png',
  fullName: 'Jane Seller',
  description: 'Professional Seller',
  country: 'USA',
  oneliner: 'Top-rated seller',
  skills: ['design', 'illustration'],
  experience: [],
  education: [],
  certificates: [],
  ratingSum: 45,
  ratingsCount: 10
};

/**
 * Build a mock Request object
 */
export const sellerMockRequest = (
  sessionData: IJWT = {},
  body: Partial<ISellerMockData> = {},
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
export const sellerMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
