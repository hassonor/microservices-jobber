import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/authService';

export class PasswordController {
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const response: AxiosResponse = await authService.forgotPassword(email);

    res.status(StatusCodes.OK).json({ message: response.data.user });
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    const response: AxiosResponse = await authService.resetPassword(token, password, confirmPassword);

    res.status(StatusCodes.OK).json({ message: response.data.user });
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const response: AxiosResponse = await authService.changePassword(currentPassword, newPassword);

    res.status(StatusCodes.OK).json({ message: response.data.user });
  }
}
