import { Response } from 'express';
import { IAuthDocument, IAuthPayload } from '@ohjobber/shared';

export const authMockRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: IAuthPayload | null, params?: unknown) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date | string;
}

export const authUserPayload: IAuthPayload = {
  id: 1,
  username: 'hasson_test',
  email: 'hassontest@gmail.com',
  iat: 1245282483
};

export const authMock: IAuthDocument = {
  id: 1,
  profilePublicId: '12542871373734565328',
  username: 'hasson_test',
  email: 'hassontest@gmail.com',
  country: 'Israel',
  profilePicture: '',
  emailVerified: 1,
  createdAt: '2024-01-01T07:43:23.342Z',
  comparePassword: () => {},
  hashPassword: () => {}
} as unknown as IAuthDocument;
