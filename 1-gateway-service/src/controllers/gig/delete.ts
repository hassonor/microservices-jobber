import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { gigService } from '@gateway/services/api/gigService';

export class DeleteGigController {
  public async gig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.deleteGig(req.params.gigId, req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
