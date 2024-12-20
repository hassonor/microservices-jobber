import { Request, Response } from 'express';
import * as auth from '@auth/services/auth';
import * as helper from '@ohjobber/shared';
import { authMock, authMockRequest, authMockResponse, authUserPayload } from '@auth/controllers/test/mocks/auth.mock';
import { getCurrentUser, resendEmail } from '@auth/controllers/currentUser';
import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize';
import { publishDirectMessage } from '@auth/queues/producers/auth';

jest.mock('@auth/services/auth');
jest.mock('@auth/queues/producers/auth');
jest.mock('@ohjobber/shared');
jest.mock('@elastic/elasticsearch');

const USERNAME = 'hasson_test';
const PASSWORD = 'test1';

let mockConnection: Sequelize;

describe('CurrentUser', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockConnection = new Sequelize(process.env.MYSQL_DB!, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        multipleStatements: true
      }
    });
    await mockConnection.sync({ force: true });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mockConnection.close();
  });

  describe('getCurrentUser method', () => {
    it('should return an authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        {
          username: USERNAME,
          password: PASSWORD
        },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);

      await getCurrentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authenticated user', user: authMock });
    });
    it('should return empty user', async () => {
      const req: Request = authMockRequest(
        {},
        {
          username: USERNAME,
          password: PASSWORD
        },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue({} as never);

      await getCurrentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: null
      });
    });

    it('should correctly handle an internal error scenario', async () => {
      const req: Request = authMockRequest({}, {}, authUserPayload) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserById').mockRejectedValue(new Error('Internal server error'));

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An unexpected error occurred.'
      });
    });
  });

  describe('resendEmail method', () => {
    it('should call BadRequestError for invalid email', async () => {
      const req: Request = authMockRequest(
        {},
        {
          username: USERNAME,
          password: PASSWORD
        },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserByEmail').mockRejectedValue({} as never);

      await resendEmail(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith('Email is invalid', 'CurrentUser resendEmail() method error');
      });
    });
    it('should call updateVerifyEmailField and publishDirectMessage methods', async () => {
      const req: Request = authMockRequest(
        {},
        {
          username: USERNAME,
          password: PASSWORD
        },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);

      await resendEmail(req, res);
      expect(auth.updateVerifyEmailField).toHaveBeenCalled();
      expect(publishDirectMessage).toHaveBeenCalled();
    });
    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        {
          username: USERNAME,
          password: PASSWORD
        },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);

      await resendEmail(req, res);
      expect(auth.updateVerifyEmailField).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verification sent',
        user: authMock
      });
    });
  });
});
