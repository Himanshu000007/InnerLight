import { ReplyService } from '../services/replyService.js';

const replyService = new ReplyService();

export const createReply = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const reply = await replyService.createReply(postId, userId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Reply created successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const getRepliesByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await replyService.getRepliesByPost(postId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.replies,
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

export const getUserReplies = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await replyService.getUserReplies(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.replies,
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

export const likeReply = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { replyId } = req.params;

    const reply = await replyService.likeReply(replyId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Reply liked successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikeReply = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { replyId } = req.params;

    const reply = await replyService.unlikeReply(replyId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Reply unliked successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const reply = await replyService.updateReply(replyId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Reply updated successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { replyId } = req.params;

    const result = await replyService.deleteReply(userId, replyId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};