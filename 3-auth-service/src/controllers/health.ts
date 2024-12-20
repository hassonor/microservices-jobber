import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '@ohjobber/shared';

export function health(_req: Request, res: Response): void {
  try {
    res.status(StatusCodes.OK).send('Auth service is healthy and OK.');
  } catch (error) {
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Auth service not healthy.' });
  }
}
