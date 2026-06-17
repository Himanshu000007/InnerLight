import { ChatService } from '../services/chatService.js';

const chatService = new ChatService();

export const initiateChat = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        status: 'error',
        message: 'Post ID is required to initiate chat',
      });
    }

    const chat = await chatService.initiateChat(userId, postId);

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const chats = await chatService.getUserChats(userId);

    res.status(200).json({
      status: 'success',
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { chatId } = req.params;

    const messages = await chatService.getChatMessages(userId, chatId);

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Message content cannot be empty',
      });
    }

    const message = await chatService.sendMessage(userId, chatId, content);

    res.status(201).json({
      status: 'success',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
