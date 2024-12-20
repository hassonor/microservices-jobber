import { Request, Response } from 'express';
import { authUserPayload, buyerDocument, buyerMockRequest, buyerMockResponse } from '@users/controllers/buyer/test/mocks/buyer';
import * as buyer from '@users/services/buyer';
import { buyerByCurrentUsername, buyerByEmail, buyerByUsername } from '@users/controllers/buyer/get';
import { StatusCodes } from 'http-status-codes';

jest.mock('@users/services/buyer');
jest.mock('@ohjobber/shared');
jest.mock('@elastic/elasticsearch');

describe('Buyer Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('email method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByEmail').mockResolvedValue(buyerDocument);

      await buyerByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerDocument });
    });
    it('should return null if buyer not found', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByEmail').mockResolvedValue(null);

      await buyerByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: null });
    });
  });

  describe('currentUser method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerDocument);

      await buyerByCurrentUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerDocument });
    });
    it('should return null if buyer not found', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(null);

      await buyerByCurrentUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: null });
    });
  });

  describe('username method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload, { username: 'hasson_test' }) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerDocument);

      await buyerByUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerDocument });
    });
    it('should return null if buyer not found', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload, { username: 'hasson_test' }) as unknown as Request;
      const res: Response = buyerMockResponse();

      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(null);

      await buyerByUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: null });
    });
  });
});
