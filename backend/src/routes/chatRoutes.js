import express from 'express';
import {
  initiateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

router.post('/', initiateChat);
router.get('/', getUserChats);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

export default router;
