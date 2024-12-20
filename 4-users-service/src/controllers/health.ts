import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '@ohjobber/shared';

const health = (_req: Request, res: Response): void => {
  try {
    res.status(StatusCodes.OK).send('Users service is healthy and OK.');
  } catch (error) {
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Users service not healthy.' });
  }
};

export { health };
