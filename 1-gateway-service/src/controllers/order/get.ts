import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { orderService } from '@gateway/services/api/orderService';

export class GetController {
  public async orderId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getOrderById(req.params.orderId);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async sellerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.sellerOrders(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async buyerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.buyerOrders(req.params.buyerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async notifications(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getNotifications(req.params.userTo);
    res.status(StatusCodes.OK).json({ message: response.data.message, notifications: response.data.notifications });
  }
}
