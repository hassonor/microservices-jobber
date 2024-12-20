import { Request, Response } from 'express';
import { IMessageDocument } from '@ohjobber/shared';
import { markMessageAsRead, markMultipleMessagesAsRead, updateOffer } from '@chat/services/message';
import { StatusCodes } from 'http-status-codes';

const updateOfferController = async (req: Request, res: Response): Promise<void> => {
  const { messageId, type } = req.body;
  const message: IMessageDocument = await updateOffer(messageId, type);
  res.status(StatusCodes.OK).json({ message: 'Message updated', singleMessage: message });
};

const updateMarkMultipleMessagesController = async (req: Request, res: Response): Promise<void> => {
  const { messageId, senderUsername, receiverUsername } = req.body;
  await markMultipleMessagesAsRead(messageId, senderUsername, receiverUsername);
  res.status(StatusCodes.OK).json({ message: 'Messages marked as read' });
};

const updateMarkSingleMessageController = async (req: Request, res: Response): Promise<void> => {
  const { messageId } = req.body;
  const message: IMessageDocument = await markMessageAsRead(messageId);
  res.status(StatusCodes.OK).json({ message: 'Message marked as read', singleMessage: message });
};

export { updateOfferController, updateMarkMultipleMessagesController, updateMarkSingleMessageController };
