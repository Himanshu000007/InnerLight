import Bookmark from '../models/Bookmark.js';

export class BookmarkRepository {
  async create(bookmarkData) {
    const bookmark = new Bookmark(bookmarkData);
    return await bookmark.save();
  }

  async findByUserAndPost(userId, postId) {
    return await Bookmark.findOne({ userId, postId });
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Bookmark.countDocuments({ userId });
    const bookmarks = await Bookmark.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate('postId')
      .sort({ createdAt: -1 });

    return {
      bookmarks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async delete(id) {
    return await Bookmark.findByIdAndDelete(id);
  }

  async deleteByUserAndPost(userId, postId) {
    return await Bookmark.deleteOne({ userId, postId });
  }
}