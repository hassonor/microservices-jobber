/**
 * refreshToken.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { RefreshTokenController } from '@gateway/controllers/auth/refreshToken';
import { authMockRequest, authMockResponse, authUserPayload } from '@gateway/controllers/auth/test/mocks/auth.mock';
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

describe('RefreshTokenController', () => {
  let req: Request;
  let res: Response;
  let refreshTokenController: RefreshTokenController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, {}, authUserPayload) as Request;
    res = authMockResponse();
    refreshTokenController = new RefreshTokenController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshToken method', () => {
    it('should return new token and user data', async () => {
      jest.spyOn(authService, 'getRefreshToken').mockResolvedValue({
        data: {
          message: 'Token refreshed',
          user: { username: 'hasson_test' },
          token: 'new_jwt_token'
        }
      } as unknown as AxiosResponse);

      await refreshTokenController.refreshToken(req, res);
      expect(authService.getRefreshToken).toHaveBeenCalledWith('hasson_test');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token refreshed',
        user: { username: 'hasson_test' },
        token: 'new_jwt_token'
      });
    });
  });
});
