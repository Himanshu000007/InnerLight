import { BookmarkRepository } from '../repositories/bookmarkRepository.js';

const bookmarkRepository = new BookmarkRepository();

export class BookmarkService {
  async bookmarkPost(userId, postId) {
    try {
      const existingBookmark = await bookmarkRepository.findByUserAndPost(
        userId,
        postId
      );

      if (existingBookmark) {
        throw new Error('Post already bookmarked');
      }

      const bookmark = await bookmarkRepository.create({
        userId,
        postId,
      });

      return {
        success: true,
        message: 'Post bookmarked successfully',
        bookmark,
      };
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  }

  async removeBookmark(userId, postId) {
    try {
      await bookmarkRepository.deleteByUserAndPost(userId, postId);

      return {
        success: true,
        message: 'Bookmark removed successfully',
      };
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getUserBookmarks(userId, page = 1, limit = 10) {
    try {
      return await bookmarkRepository.findByUserId(userId, page, limit);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  }

  async isPostBookmarked(userId, postId) {
    try {
      const bookmark = await bookmarkRepository.findByUserAndPost(userId, postId);
      return !!bookmark;
    } catch (error) {
      console.error('Error checking bookmark:', error);
      throw error;
    }
  }
}