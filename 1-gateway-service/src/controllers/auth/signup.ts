import { Request, Response } from 'express';
import { authService } from '@gateway/services/api/authService';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export class SignUpController {
  public async create(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: response.data.user });
  }
}
