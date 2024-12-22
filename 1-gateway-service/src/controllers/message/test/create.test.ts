/**
 * createMessage.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { CreateController } from '@gateway/controllers/message/create';
import { messageService } from '@gateway/services/api/messageService';
import {
  messageMockRequest,
  messageMockResponse,
  messageMockData
} from './mocks/message.mock';
import { Server } from 'socket.io';
import * as socketServer from '@gateway/server';


jest.mock('@ohjobber/shared');
jest.mock('@gateway/services/api/messageService');
jest.mock('@gateway/redis/gateway.cache');
jest.mock('@gateway/server');
jest.mock('@elastic/elasticsearch');

// Mock socketIO
Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('CreateController', () => {
  let req: Request;
  let res: Response;
  let createController: CreateController;

  beforeEach(() => {
    jest.resetAllMocks();
    req = messageMockRequest({}, messageMockData) as Request;
    res = messageMockResponse();
    createController = new CreateController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('message method', () => {
    it('should create a new message and respond with status 200', async () => {
      jest.spyOn(messageService, 'addMessage').mockResolvedValue({
        data: {
          message: 'Message created successfully',
          conversationId: 'conv123',
          messageData: { ...messageMockData }
        }
      } as unknown as AxiosResponse);

      await createController.message(req, res);

      expect(messageService.addMessage).toHaveBeenCalledWith(messageMockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message created successfully',
        conversationId: 'conv123',
        messageData: { ...messageMockData }
      });
    });
  });
});
