/**
 * gig.mock.ts
 */
import { Response } from 'express';

export interface IJWT {
  jwt?: string;
}

export interface IGigMockData {
  _id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  active?: boolean;
}

export const gigMockData: IGigMockData = {
  _id: 'abc123',
  sellerId: 'seller123',
  title: 'Test Gig',
  description: 'This is a test gig',
  price: 50
};

export const gigMockRequest = (
  sessionData: IJWT = {},
  body: Partial<IGigMockData> = {},
  currentUser: unknown = null,
  params: Record<string, any> = {}
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const gigMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
