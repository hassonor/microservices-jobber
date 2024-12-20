import { IAuthPayload, IReviewDocument } from '@ohjobber/shared';
import { Response } from 'express';

export const reviewMockRequest = (sessionData: IJWT, body: IReviewDocument, currentUser?: IAuthPayload | null, params?: IParams) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const reviewMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export const authUserPayload: IAuthPayload = {
  id: 2,
  username: 'orh',
  email: 'orh@me.com',
  iat: 12345
};

export interface IParams {
  username?: string;
}

export const reviewDocument: IReviewDocument = {
  _id: '60263f14648fed5246e3452w',
  gigId: '60263f14648fed5246e322q4',
  reviewerId: '60263f14648fed5246e322q4',
  sellerId: '60263f14648fed5246e322q4',
  review: 'I love the job that was done',
  reviewerImage: 'https://placehold.co/600x400',
  rating: 5,
  orderId: '60263f14648fed5246e322e4',
  createdAt: '2024-10-20T07:42:24.451Z',
  reviewerUsername: 'Or',
  country: 'Israel',
  reviewType: 'seller-review'
};
