import Post from '../models/Post.js';

export class PostRepository {
  async create(postData) {
    const post = new Post(postData);
    return await post.save();
  }

  async countDocuments(filters = {}) {
    return await Post.countDocuments(filters);
  }

  async findById(id) {
    return await Post.findById(id).populate('userId', 'firstName lastName avatar');
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = { isArchived: false, ...filters };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Post.countDocuments({ userId, isArchived: false });
    const posts = await Post.find({ userId, isArchived: false })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async search(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = {
      isArchived: false,
      content: { $regex: searchTerm, $options: 'i' },
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByTag(tag, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { tags: tag, isArchived: false };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async addLike(postId, userId) {
    return await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      { new: true }
    );
  }

  async removeLike(postId, userId) {
    return await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true }
    );
  }

  async incrementReplyCount(postId) {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { replyCount: 1 } },
      { new: true }
    );
  }

  async decrementReplyCount(postId) {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { replyCount: -1 } },
      { new: true }
    );
  }

  async addReport(postId, reportData) {
    return await Post.findByIdAndUpdate(
      postId,
      { $push: { reports: reportData } },
      { new: true }
    );
  }

  async update(id, updateData) {
    return await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Post.findByIdAndDelete(id);
  }
}