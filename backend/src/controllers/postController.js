import { PostService } from '../services/postService.js';
import { BookmarkService } from '../services/bookmarkService.js';

const postService = new PostService();
const bookmarkService = new BookmarkService();

export const createPost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const post = await postService.createPost(userId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const filters = {};
    if (category) filters.category = category;

    const result = await postService.getAllPosts(page, limit, filters);

    res.status(200).json({
      status: 'success',
      data: result.posts,
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

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await postService.getUserPosts(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.posts,
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

export const searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term is required',
      });
    }

    const result = await postService.searchPosts(q, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.posts,
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

export const getPostsByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await postService.getPostsByTag(tag, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.posts,
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

export const likePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await postService.likePost(postId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Post liked successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await postService.unlikePost(postId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Post unliked successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.updatePost(postId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const result = await postService.deletePost(userId, postId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const bookmarkPost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const result = await bookmarkService.bookmarkPost(userId, postId);

    res.status(201).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const result = await bookmarkService.removeBookmark(userId, postId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};