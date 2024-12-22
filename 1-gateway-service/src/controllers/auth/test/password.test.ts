/**
 * password.test.ts
 */

import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { authService } from '@gateway/services/api/authService';
import { PasswordController } from '@gateway/controllers/auth/password';
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

describe('PasswordController', () => {
  let req: Request;
  let res: Response;
  let passwordController: PasswordController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = authMockRequest({}, {}, null) as Request;
    res = authMockResponse();
    passwordController = new PasswordController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword method', () => {
    it('should return correct response', async () => {
      req.body = { email: 'test@example.com' };

      jest.spyOn(authService, 'forgotPassword').mockResolvedValue({
        data: { user: 'Forgot password requested' }
      } as unknown as AxiosResponse);

      await passwordController.forgotPassword(req, res);
      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forgot password requested' });
    });
  });

  describe('resetPassword method', () => {
    it('should return correct response', async () => {
      req.params = { token: 'reset_token_123' };
      req.body = {
        password: 'newPassword',
        confirmPassword: 'newPassword'
      };

      jest.spyOn(authService, 'resetPassword').mockResolvedValue({
        data: { user: 'Password has been reset' }
      } as unknown as AxiosResponse);

      await passwordController.resetPassword(req, res);
      expect(authService.resetPassword).toHaveBeenCalledWith('reset_token_123', 'newPassword', 'newPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset' });
    });
  });

  describe('changePassword method', () => {
    it('should return correct response', async () => {
      req.body = { currentPassword: 'oldPassword', newPassword: 'newPassword' };

      jest.spyOn(authService, 'changePassword').mockResolvedValue({
        data: { user: 'Password changed successfully' }
      } as unknown as AxiosResponse);

      await passwordController.changePassword(req, res);
      expect(authService.changePassword).toHaveBeenCalledWith('oldPassword', 'newPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });
  });
});
