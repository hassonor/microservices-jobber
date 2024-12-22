/**
 * seed.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { AuthSeedController } from '@gateway/controllers/auth/seed';
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

describe('AuthSeedController', () => {
  let req: Request;
  let res: Response;
  let seedController: AuthSeedController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, {}, null) as Request;
    res = authMockResponse();
    seedController = new AuthSeedController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAuthUsers method', () => {
    it('should seed users and return correct message', async () => {
      req.params = { count: '10' };

      jest.spyOn(authService, 'seed').mockResolvedValue({
        data: { message: '10 users seeded successfully' }
      } as unknown as AxiosResponse);

      await seedController.createAuthUsers(req, res);
      expect(authService.seed).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '10 users seeded successfully' });
    });
  });
});
