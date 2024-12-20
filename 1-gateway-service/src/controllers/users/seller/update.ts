import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { sellerService } from '@gateway/services/api/sellerService';

export class UpdateSellerController {
  public async update(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.updateSeller(req.params.sellerId, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }
}
