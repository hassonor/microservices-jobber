import { Response } from 'express';
import { IAuthPayload, IBuyerDocument } from '@ohjobber/shared';

export const buyerMockRequest = (sessionData: IJWT, currentUser?: IAuthPayload | null, params?: IParams) => ({
  session: sessionData,
  params,
  currentUser
});

export const buyerMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IParams {
  username?: string;
}

export const authUserPayload: IAuthPayload = {
  id: 1,
  username: 'hasson_test',
  email: 'hassontest@gmail.com',
  iat: 1245282483
};

export const buyerDocument: IBuyerDocument = {
  _id: '6627cd6f23db994bd611324b',
  username: 'hasson_test',
  email: 'hassontest@gmail.com',
  country: 'Israel',
  profilePicture: '',
  isSeller: false,
  purchasedGigs: [],
  createdAt: '2024-01-01T07:43:23.342Z'
} as IBuyerDocument;
