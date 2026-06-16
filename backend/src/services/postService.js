import { PostRepository } from '../repositories/postRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { ReplyRepository } from '../repositories/replyRepository.js';

const postRepository = new PostRepository();
const userRepository = new UserRepository();
const replyRepository = new ReplyRepository();

export class PostService {
  async createPost(userId, postData) {
    try {
      const post = await postRepository.create({
        userId,
        ...postData,
      });

      await userRepository.incrementStatistics(userId, 'totalPosts');

      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getAllPosts(page = 1, limit = 10, filters = {}) {
    try {
      return await postRepository.findAll(page, limit, filters);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getPostById(postId) {
    try {
      return await postRepository.findById(postId);
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  async getUserPosts(userId, page = 1, limit = 10) {
    try {
      return await postRepository.findByUserId(userId, page, limit);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }

  async searchPosts(searchTerm, page = 1, limit = 10) {
    try {
      return await postRepository.search(searchTerm, page, limit);
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async getPostsByTag(tag, page = 1, limit = 10) {
    try {
      return await postRepository.findByTag(tag, page, limit);
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      throw error;
    }
  }

  async likePost(postId, userId) {
    try {
      return await postRepository.addLike(postId, userId);
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async unlikePost(postId, userId) {
    try {
      return await postRepository.removeLike(postId, userId);
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  async updatePost(postId, updateData) {
    try {
      const allowedFields = ['content', 'category', 'tags'];
      const filteredData = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      return await postRepository.update(postId, filteredData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(userId, postId) {
    try {
      const post = await postRepository.findById(postId);

      if (post.userId.toString() !== userId) {
        throw new Error('Unauthorized to delete this post');
      }

      await postRepository.delete(postId);
      await userRepository.decrementStatistics(userId, 'totalPosts');

      return {
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async archivePost(postId) {
    try {
      return await postRepository.update(postId, { isArchived: true });
    } catch (error) {
      console.error('Error archiving post:', error);
      throw error;
    }
  }
}