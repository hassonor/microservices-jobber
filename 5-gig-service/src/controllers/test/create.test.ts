import { authUserPayload, gigMockRequest, gigMockResponse, sellerGig } from '@gig/controllers/test/mocks/gig.mock';
import { Request, Response } from 'express';
import { gigCreateSchema } from '@gig/schemes/gig';
import { gigCreateController } from '@gig/controllers/create';
import { BadRequestError } from '@ohjobber/shared';
import * as helper from '@ohjobber/shared';
import * as gigService from '@gig/services/gig';

jest.mock('@gig/services/gig');
jest.mock('@ohjobber/shared');
jest.mock('@gig/schemes/gig');
jest.mock('@gig/elasticsearch');
jest.mock('@elastic/elasticsearch');

describe('Create Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create new gig method', () => {
    it('should throw an error for invalid schema data', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidationError',
            isJoi: true,
            details: [{ message: 'This is an error message' }]
          }
        })
      );
      gigCreateController(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('This is an error message', 'Create gig() method');
      });
    });
    it('should throw file upload error', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {}
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '' }));
      gigCreateController(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('File upload error. Try again.', ' Create gig() method');
      });
    });
    it('should create a new gig', async () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {}
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '11117' }));
      jest.spyOn(gigService, 'createGig').mockResolvedValue(sellerGig);

      await gigCreateController(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig created successfully.',
        gig: sellerGig
      });
    });
  });
});
