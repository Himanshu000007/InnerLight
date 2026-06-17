import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export class ChatRepository {
  async findOrCreate(participantA, participantB, postId) {
    // Check if chat session already exists for this post between these participants
    let chat = await Chat.findOne({
      postId,
      participants: { $all: [participantA, participantB] },
      status: 'active',
    });

    if (!chat) {
      chat = new Chat({
        participants: [participantA, participantB],
        postId,
        status: 'active',
      });
      await chat.save();
    }
    return chat;
  }

  async findUserChats(userId) {
    return await Chat.find({
      participants: userId,
      status: 'active',
    })
      .populate('participants', 'firstName lastName avatar')
      .populate('postId', 'content category')
      .sort({ updatedAt: -1 });
  }

  async findChatById(chatId) {
    return await Chat.findById(chatId)
      .populate('participants', 'firstName lastName avatar')
      .populate('postId', 'content category userId');
  }

  async createMessage(messageData) {
    const message = new Message(messageData);
    await message.save();
    
    // Update the chat timestamp so it shows up first in the user list
    await Chat.findByIdAndUpdate(message.chatId, { updatedAt: new Date() });
    
    return message;
  }

  async getChatMessages(chatId) {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  }
}
