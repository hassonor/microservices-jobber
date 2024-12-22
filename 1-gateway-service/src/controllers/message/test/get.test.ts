/**
 * getMessage.test.ts
 */
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { GetController } from '@gateway/controllers/message/get';
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

Object.defineProperties(socketServer, {
  socketIO: {
    value: new Server(),
    writable: true
  }
});

describe('GetController', () => {
  let req: Request;
  let res: Response;
  let getController: GetController;

  beforeEach(() => {
    jest.resetAllMocks();
    res = messageMockResponse();
    getController = new GetController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('conversation method', () => {
    it('should fetch conversation between sender and receiver', async () => {
      req = messageMockRequest({}, {}, null, {
        senderUsername: 'john_doe',
        receiverUsername: 'jane_doe'
      }) as Request;

      jest.spyOn(messageService, 'getConversation').mockResolvedValue({
        data: {
          message: 'Conversation fetched',
          conversations: ['someConversationData']
        }
      } as unknown as AxiosResponse);

      await getController.conversation(req, res);
      expect(messageService.getConversation).toHaveBeenCalledWith('john_doe', 'jane_doe');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Conversation fetched',
        conversations: ['someConversationData']
      });
    });
  });

  describe('messages method', () => {
    it('should fetch messages between sender and receiver', async () => {
      req = messageMockRequest({}, {}, null, {
        senderUsername: 'john_doe',
        receiverUsername: 'jane_doe'
      }) as Request;

      jest.spyOn(messageService, 'getMessages').mockResolvedValue({
        data: {
          message: 'Messages fetched',
          messages: [messageMockData]
        }
      } as unknown as AxiosResponse);

      await getController.messages(req, res);
      expect(messageService.getMessages).toHaveBeenCalledWith('john_doe', 'jane_doe');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Messages fetched',
        messages: [messageMockData]
      });
    });
  });

  describe('conversationList method', () => {
    it('should fetch conversation list for a given user', async () => {
      req = messageMockRequest({}, {}, null, { username: 'john_doe' }) as Request;

      jest.spyOn(messageService, 'getConversationList').mockResolvedValue({
        data: {
          message: 'User conversations',
          conversations: ['conversation1', 'conversation2']
        }
      } as unknown as AxiosResponse);

      await getController.conversationList(req, res);
      expect(messageService.getConversationList).toHaveBeenCalledWith('john_doe');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User conversations',
        conversations: ['conversation1', 'conversation2']
      });
    });
  });

  describe('userMessages method', () => {
    it('should fetch user messages by conversationId', async () => {
      req = messageMockRequest({}, {}, null, { conversationId: 'conv123' }) as Request;

      jest.spyOn(messageService, 'getUserMessages').mockResolvedValue({
        data: {
          message: 'User messages',
          messages: [messageMockData]
        }
      } as unknown as AxiosResponse);

      await getController.userMessages(req, res);
      expect(messageService.getUserMessages).toHaveBeenCalledWith('conv123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User messages',
        messages: [messageMockData]
      });
    });
  });
});
