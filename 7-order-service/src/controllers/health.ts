import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const health = (_rqe: Request, res: Response): void => {
  res.status(StatusCodes.OK).send('Order service is healthy and OK.');
};

export { health };
