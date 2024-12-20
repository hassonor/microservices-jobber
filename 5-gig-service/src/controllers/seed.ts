import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { publishDirectMessage } from '@gig/queues/producers/gig';
import { gigChannel } from '@gig/server';

const seedCreateGigController = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  await publishDirectMessage(
    gigChannel,
    'jobber-gig',
    'get-sellers',
    JSON.stringify({ type: 'getSellers', count }),
    'Gig seed message send to user service.'
  );
  res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully' });
};

export { seedCreateGigController };
