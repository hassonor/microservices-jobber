/**
 * updateMessage.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { UpdateController } from '@gateway/controllers/message/update';
import { messageService } from '@gateway/services/api/messageService';
import {
  messageMockRequest,
  messageMockResponse
} from './mocks/message.mock';
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/messageService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('UpdateController', () => {
  let req: Request;
  let res: Response;
  let updateController: UpdateController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = messageMockResponse();
    updateController = new UpdateController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('offer method', () => {
    it('should update a message offer and respond with status 200', async () => {
      req = messageMockRequest({}, { messageId: 'msg123', type: 'someType' }) as Request;

      jest.spyOn(messageService, 'updateOffer').mockResolvedValue({
        data: {
          message: 'Offer updated successfully',
          singleMessage: { messageId: 'msg123', type: 'someType' }
        }
      } as unknown as AxiosResponse);

      await updateController.offer(req, res);
      expect(messageService.updateOffer).toHaveBeenCalledWith('msg123', 'someType');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Offer updated successfully',
        singleMessage: { messageId: 'msg123', type: 'someType' }
      });
    });
  });

  describe('markMultipleMessages method', () => {
    it('should mark multiple messages as read and respond with status 200', async () => {
      req = messageMockRequest(
        {},
        { messageId: 'msg123', senderUsername: 'john_doe', receiverUsername: 'jane_doe' }
      ) as Request;

      jest.spyOn(messageService, 'markMultipleMessagesAsRead').mockResolvedValue({
        data: {
          message: 'Multiple messages marked as read'
        }
      } as unknown as AxiosResponse);

      await updateController.markMultipleMessages(req, res);
      expect(messageService.markMultipleMessagesAsRead).toHaveBeenCalledWith(
        'jane_doe',
        'john_doe',
        'msg123'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Multiple messages marked as read' });
    });
  });

  describe('markSingleMessage method', () => {
    it('should mark single message as read and respond with status 200', async () => {
      req = messageMockRequest({}, { messageId: 'msg123' }) as Request;

      jest.spyOn(messageService, 'markMessageAsRead').mockResolvedValue({
        data: {
          message: 'Single message marked as read',
          singleMessage: { messageId: 'msg123', read: true }
        }
      } as unknown as AxiosResponse);

      await updateController.markSingleMessage(req, res);
      expect(messageService.markMessageAsRead).toHaveBeenCalledWith('msg123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Single message marked as read',
        singleMessage: { messageId: 'msg123', read: true }
      });
    });
  });
});
