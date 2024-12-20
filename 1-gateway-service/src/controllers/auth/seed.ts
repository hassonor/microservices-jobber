import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/authService';

export class AuthSeedController {
  public async createAuthUsers(req: Request, res: Response): Promise<void> {
    const { count } = req.params;
    const response: AxiosResponse = await authService.seed(count);

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
