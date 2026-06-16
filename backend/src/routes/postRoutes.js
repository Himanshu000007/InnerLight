import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  searchPosts,
  getPostsByTag,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  bookmarkPost,
  removeBookmark,
} from '../controllers/postController.js';
import {
  createPostValidator,
  updatePostValidator,
} from '../validators/postValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);

router.get('/search', searchPosts);

router.get('/tag/:tag', getPostsByTag);

router.get('/:postId', getPostById);

router.use(authenticate);

router.post('/', createPostValidator, handleValidationErrors, createPost);

router.get('/user/posts', getUserPosts);

router.post('/:postId/like', likePost);

router.post('/:postId/unlike', unlikePost);

router.put('/:postId', updatePostValidator, handleValidationErrors, updatePost);

router.delete('/:postId', deletePost);

router.post('/:postId/bookmark', bookmarkPost);

router.delete('/:postId/bookmark', removeBookmark);

export default router;