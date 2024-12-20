import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/authService';

export class RefreshTokenController {
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const username = req.currentUser!.username;
    const response: AxiosResponse = await authService.getRefreshToken(username);

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      user: response.data.user,
      token: response.data.token
    });
  }
}
