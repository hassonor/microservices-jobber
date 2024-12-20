import * as crypto from 'node:crypto';

import { Request, Response } from 'express';
import { messageSchema } from '@chat/schemes/message';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError, IMessageDocument, uploads } from '@ohjobber/shared';
import { addMessage, createConversation } from '@chat/services/message';
import { StatusCodes } from 'http-status-codes';

const createMessageController = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(messageSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create createMessage() method');
  }

  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  if (file) {
    const result: UploadApiResponse = (
      req.body.fileType === 'zip' ? await uploads(file, `${randomCharacters}.zip`) : await uploads(file)
    ) as UploadApiResponse;

    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again', 'Create createMessage() method');
    }
    file = result?.secure_url;
  }

  const messageData: IMessageDocument = {
    conversationId: req.body.conversationId,
    body: req.body.body,
    file,
    fileType: req.body.fileType,
    fileSize: req.body.fileSize,
    fileName: req.body.fileName,
    gigId: req.body.gigId,
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    senderUsername: req.body.senderUsername,
    senderPicture: req.body.senderPicture,
    receiverUsername: req.body.receiverUsername,
    receiverPicture: req.body.receiverPicture,
    isRead: req.body.isRead,
    hasOffer: req.body.hasOffer,
    offer: req.body.offer
  };
  if (!req.body.hasConversationId) {
    await createConversation(`${messageData.conversationId}`, `${messageData.senderUsername}`, `${messageData.receiverUsername}`);
  }
  await addMessage(messageData);
  res.status(StatusCodes.OK).json({ message: 'Message added', conversationId: req.body.conversationId, messageData });
};

export { createMessageController };
