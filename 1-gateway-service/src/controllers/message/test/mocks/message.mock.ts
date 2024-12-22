/**
 * message.mock.ts
 */
import { Response } from 'express';

export interface IJWT {
  jwt?: string;
}

export interface IMsgMockData {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  messageId?: string;
  type?: string;
  read?: boolean;
  senderUsername?: string;
  receiverUsername?: string;
}

/**
 * Example data for message tests
 */
export const messageMockData: IMsgMockData = {
  _id: 'msg123',
  sender: 'john_doe',
  receiver: 'jane_doe',
  content: 'Hello Jane!'

};

/**
 * Mock request generator for message tests
 */
export const messageMockRequest = (
  sessionData: IJWT = {},
  body: Partial<IMsgMockData> = {},
  currentUser: unknown = null,
  params: Record<string, any> = {}
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

/**
 * Mock response generator for message tests
 */
export const messageMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
