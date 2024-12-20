import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/authService';

export class VerifyEmailController {
  public async update(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.verifyEmail(req.body.token);
    res.status(StatusCodes.OK).json({ message: 'Email Verified successfully', user: response.data.user });
  }
}
