import { BookmarkService } from '../services/bookmarkService.js';

const bookmarkService = new BookmarkService();

export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await bookmarkService.getUserBookmarks(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.bookmarks,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const isBookmarked = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const isBookmarked = await bookmarkService.isPostBookmarked(userId, postId);

    res.status(200).json({
      status: 'success',
      data: { isBookmarked },
    });
  } catch (error) {
    next(error);
  }
};