/**
 * signin.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { SignInController } from '@gateway/controllers/auth/signin';
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

describe('SignInController', () => {
  let req: Request;
  let res: Response;
  let signInController: SignInController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, { username: 'testuser', password: 'test123' }) as Request;
    res = authMockResponse();
    signInController = new SignInController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login method', () => {
    it('should set session token and return user info', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue({
        data: {
          token: 'jwt_token_example',
          user: { username: 'testuser', email: 'testuser@example.com' }
        }
      } as unknown as AxiosResponse);

      await signInController.login(req, res);
      expect(authService.signIn).toHaveBeenCalledWith({ username: 'testuser', password: 'test123' });
      expect(req.session).toEqual({ jwt: 'jwt_token_example' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User login successfully',
        user: { username: 'testuser', email: 'testuser@example.com' }
      });
    });
  });
});
