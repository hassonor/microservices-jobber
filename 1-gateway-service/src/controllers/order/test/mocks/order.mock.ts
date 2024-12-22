/**
 * order.mock.ts
 *
 * This file contains mock interfaces and data for testing the Order controllers.
 */

import { Response } from 'express';
import {
  IOrderDocument,
  IOrderNotifcation
} from '@ohjobber/shared';

/**
 * Extend IOrderDocument with partial fields so we can mock them as needed.
 * Also include any additional test-specific fields like "messageId".
 */
export interface IOrderMockData extends Partial<IOrderDocument> {
  notification?: Partial<IOrderNotifcation>;
  messageId?: string;            // if your tests need something like this
  someOtherTestField?: string;   // add any other fields your tests might pass
  newDate?: string;            // For update delivery date
  files?: string[];            // For deliverOrder
  rating?: number;             // For approveOrder
  notificationId?: string;     // For markNotificationAsRead
  paymentIntentId?:string;
  orderData?:string;
  reason?:string;
}

/**
 * Basic interface for mocking session JWT
 */
export interface IJWT {
  jwt?: string;
}

/**
 * Example order mock data.
 * You can add as many fields as your tests require.
 */
export const orderMockData: IOrderMockData = {
  orderId: 'orderABC',
  buyerId: 'buyer123',
  buyerUsername: 'JohnBuyer',
  sellerId: 'seller789',
  sellerUsername: 'JaneSeller',
  gigId: 'gigXYZ',
  price: 250,
  status: 'IN_PROGRESS',
  events: {
    placeOrder: '2024-01-01T10:00:00Z',
    requirements: '2024-01-01T10:15:00Z',
    orderStarted: '2024-01-01T10:30:00Z',
    deliveryDateUpdate: '2024-01-02T08:00:00Z',
    orderDelivered: '2024-01-03T17:00:00Z',
    buyerReview: '2024-01-04T12:00:00Z',
    sellerReview: '2024-01-05T09:00:00Z'
  },
  requestExtension: {
    originalDate: '2024-01-03',
    newDate: '2024-01-05',
    days: 2,
    reason: 'Need extra time for design'
  }
};

/**
 * Build a mock Request object.
 */
export const orderMockRequest = (
  sessionData: IJWT = {},
  body: Partial<IOrderMockData> = {},
  currentUser: unknown = null,
  params: Record<string, any> = {}
) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

/**
 * Build a mock Response object with .status() and .json() spied.
 */
export const orderMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
