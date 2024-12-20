import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IOrderNotifcation } from '@ohjobber/shared';
import { getNotificationsById } from '@order/services/notification';

const notifications = async (req: Request, res: Response): Promise<void> => {
  const notifications: IOrderNotifcation[] = await getNotificationsById(req.params.userTo);
  res.status(StatusCodes.OK).json({ message: 'Notifications', notifications });
};

export { notifications };
