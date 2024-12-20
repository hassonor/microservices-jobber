import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { sellerService } from '@gateway/services/api/sellerService';

export class SeedSellerController {
  public async seed(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.seed(req.params.count);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
