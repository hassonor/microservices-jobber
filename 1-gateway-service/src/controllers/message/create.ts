import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { messageService } from '@gateway/services/api/messageService';

export class CreateController {
  public async message(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.addMessage(req.body);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      conversationId: response.data.conversationId,
      messageData: response.data.messageData
    });
  }
}
