import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const healthController = (_req: Request, res: Response): void => {
  res.status(StatusCodes.OK).send('Gig service is healthy and OK.');
};

export { healthController };
