/**
 * signup.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { SignUpController } from '@gateway/controllers/auth/signup';
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

describe('SignUpController', () => {
  let req: Request;
  let res: Response;
  let signUpController: SignUpController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, { username: 'testuser', email: 'testuser@example.com', password: 'test123' }) as Request;
    res = authMockResponse();
    signUpController = new SignUpController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should set session token and return new user info', async () => {
      jest.spyOn(authService, 'signUp').mockResolvedValue({
        data: {
          token: 'new_jwt_token',
          user: { username: 'testuser', email: 'testuser@example.com' }
        }
      } as unknown as AxiosResponse);

      await signUpController.create(req, res);
      expect(authService.signUp).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'test123'
      });
      expect(req.session).toEqual({ jwt: 'new_jwt_token' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { username: 'testuser', email: 'testuser@example.com' }
      });
    });
  });
});
