import express, { Router } from 'express';
import { GetController } from '@gateway/controllers/message/get';
import { CreateController } from '@gateway/controllers/message/create';
import { UpdateController } from '@gateway/controllers/message/update';

class MessageRoutes {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/message/conversation/:senderUsername/:receiverUsername', GetController.prototype.conversation);
    this.router.get('/message/conversations/:username', GetController.prototype.conversationList);
    this.router.get('/message/:senderUsername/:receiverUsername', GetController.prototype.messages);
    this.router.get('/message/:conversationId', GetController.prototype.userMessages);
    this.router.post('/message', CreateController.prototype.message);
    this.router.put('/message/offer', UpdateController.prototype.offer);
    this.router.put('/message/mark-as-read', UpdateController.prototype.markSingleMessage);
    this.router.put('/message/mark-multiple-as-read', UpdateController.prototype.markMultipleMessages);
    return this.router;
  }
}

export const messageRoutes: MessageRoutes = new MessageRoutes();
