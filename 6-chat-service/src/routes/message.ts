import { createMessageController } from '@chat/controllers/create';
import {
  getConversationController,
  getConversationListController,
  getMessagesController,
  getUserMessagesController
} from '@chat/controllers/get';
import { updateMarkMultipleMessagesController, updateMarkSingleMessageController, updateOfferController } from '@chat/controllers/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderUsername/:receiverUsername', getConversationController);
  router.get('/conversations/:username', getConversationListController);
  router.get('/:senderUsername/:receiverUsername', getMessagesController);
  router.get('/:conversationId', getUserMessagesController);
  router.post('/', createMessageController);
  router.put('/offer', updateOfferController);
  router.put('/mark-as-read', updateMarkSingleMessageController);
  router.put('/mark-multiple-as-read', updateMarkMultipleMessagesController);

  return router;
};

export { messageRoutes };
