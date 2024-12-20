import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { orderService } from '@gateway/services/api/orderService';

export class CreateController {
  public async intent(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrderIntent(req.body.price, req.body.buyerId);

    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      clientSecret: response.data.clientSecret,
      paymentIntentId: response.data.paymentIntentId
    });
  }

  public async order(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrder(req.body);

    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      order: response.data.order
    });
  }
}
