import { ChatRepository } from '../repositories/chatRepository.js';
import { PostRepository } from '../repositories/postRepository.js';

const chatRepository = new ChatRepository();
const postRepository = new PostRepository();

export class ChatService {
  async initiateChat(userId, postId) {
    try {
      const post = await postRepository.findById(postId);
      if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }

      // Find the author of the post
      const authorId = post.userId._id || post.userId;
      
      if (authorId.toString() === userId.toString()) {
        const error = new Error('You cannot start a chat with yourself');
        error.statusCode = 400;
        throw error;
      }

      const chat = await chatRepository.findOrCreate(userId, authorId, postId);
      return chat;
    } catch (error) {
      console.error('Error initiating chat:', error);
      throw error;
    }
  }

  async getUserChats(userId) {
    try {
      return await chatRepository.findUserChats(userId);
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }

  async getChatMessages(userId, chatId) {
    try {
      const chat = await chatRepository.findChatById(chatId);
      if (!chat) {
        const error = new Error('Chat session not found');
        error.statusCode = 404;
        throw error;
      }

      // Check if user is a participant
      const isParticipant = chat.participants.some(
        (p) => p._id.toString() === userId.toString()
      );
      if (!isParticipant) {
        const error = new Error('Not authorized to view this chat');
        error.statusCode = 403;
        throw error;
      }

      return await chatRepository.getChatMessages(chatId);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  async sendMessage(userId, chatId, content) {
    try {
      const chat = await chatRepository.findChatById(chatId);
      if (!chat) {
        const error = new Error('Chat session not found');
        error.statusCode = 404;
        throw error;
      }

      // Check if user is a participant
      const isParticipant = chat.participants.some(
        (p) => p._id.toString() === userId.toString()
      );
      if (!isParticipant) {
        const error = new Error('Not authorized to message in this chat');
        error.statusCode = 403;
        throw error;
      }

      const message = await chatRepository.createMessage({
        chatId,
        senderId: userId,
        content,
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
