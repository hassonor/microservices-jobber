import { Request, Response } from 'express';
import { authService } from '@gateway/services/api/authService';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export class SignInController {
  public async login(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signIn(req.body);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.OK).json({ message: 'User login successfully', user: response.data.user });
  }
}
