import { ReplyRepository } from '../repositories/replyRepository.js';
import { PostRepository } from '../repositories/postRepository.js';

const replyRepository = new ReplyRepository();
const postRepository = new PostRepository();

export class ReplyService {
  async createReply(postId, userId, replyData) {
    try {
      const reply = await replyRepository.create({
        postId,
        userId,
        ...replyData,
      });

      await postRepository.incrementReplyCount(postId);

      return reply;
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  }

  async getRepliesByPost(postId, page = 1, limit = 10) {
    try {
      return await replyRepository.findByPostId(postId, page, limit);
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }

  async getUserReplies(userId, page = 1, limit = 10) {
    try {
      return await replyRepository.findByUserId(userId, page, limit);
    } catch (error) {
      console.error('Error fetching user replies:', error);
      throw error;
    }
  }

  async likeReply(replyId, userId) {
    try {
      return await replyRepository.addLike(replyId, userId);
    } catch (error) {
      console.error('Error liking reply:', error);
      throw error;
    }
  }

  async unlikeReply(replyId, userId) {
    try {
      return await replyRepository.removeLike(replyId, userId);
    } catch (error) {
      console.error('Error unliking reply:', error);
      throw error;
    }
  }

  async updateReply(replyId, updateData) {
    try {
      return await replyRepository.update(replyId, { content: updateData.content });
    } catch (error) {
      console.error('Error updating reply:', error);
      throw error;
    }
  }

  async deleteReply(userId, replyId) {
    try {
      const reply = await replyRepository.findById(replyId);

      if (reply.userId.toString() !== userId) {
        throw new Error('Unauthorized to delete this reply');
      }

      const postId = reply.postId;
      await replyRepository.delete(replyId);
      await postRepository.decrementReplyCount(postId);

      return {
        success: true,
        message: 'Reply deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  }
}