/**
 * verifyEmail.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { VerifyEmailController } from '@gateway/controllers/auth/verifyEmail';
import { authMockRequest, authMockResponse } from '@gateway/controllers/auth/test/mocks/auth.mock';
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';

jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/authService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('VerifyEmailController', () => {
  let req: Request;
  let res: Response;
  let verifyEmailController: VerifyEmailController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, {}, null) as Request;
    res = authMockResponse();
    verifyEmailController = new VerifyEmailController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update method', () => {
    it('should verify email and return user data', async () => {
      req.body = { token: 'email_verify_token' };

      jest.spyOn(authService, 'verifyEmail').mockResolvedValue({
        data: {
          user: { username: 'testuser', emailVerified: 1 }
        }
      } as unknown as AxiosResponse);

      await verifyEmailController.update(req, res);
      expect(authService.verifyEmail).toHaveBeenCalledWith('email_verify_token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email Verified successfully',
        user: { username: 'testuser', emailVerified: 1 }
      });
    });
  });
});
