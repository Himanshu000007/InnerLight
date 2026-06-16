import Reply from '../models/Reply.js';

export class ReplyRepository {
  async create(replyData) {
    const reply = new Reply(replyData);
    return await reply.save();
  }

  async findById(id) {
    return await Reply.findById(id).populate('userId', 'firstName lastName avatar');
  }

  async findByPostId(postId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Reply.countDocuments({ postId, isArchived: false });
    const replies = await Reply.find({ postId, isArchived: false })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    return {
      replies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Reply.countDocuments({ userId, isArchived: false });
    const replies = await Reply.find({ userId, isArchived: false })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      replies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async addLike(replyId, userId) {
    return await Reply.findByIdAndUpdate(
      replyId,
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      { new: true }
    );
  }

  async removeLike(replyId, userId) {
    return await Reply.findByIdAndUpdate(
      replyId,
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true }
    );
  }

  async update(id, updateData) {
    return await Reply.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Reply.findByIdAndDelete(id);
  }
}