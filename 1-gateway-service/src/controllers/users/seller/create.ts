import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { sellerService } from '@gateway/services/api/sellerService';

export class CreateSellerController {
  public async create(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.createSeller(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, seller: response.data.seller });
  }
}
