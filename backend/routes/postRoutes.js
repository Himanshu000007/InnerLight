import express from 'express';
import { createPost, getPosts, getPostById, replyToPost } from '../controllers/postController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Post Routes
 * 
 * POST   /api/posts - Create a new post (protected)
 * GET    /api/posts - Get all posts (public feed)
 * GET    /api/posts/:id - Get single post with replies (public)
 * POST   /api/posts/:id/reply - Reply to a post (protected)
 */

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes (require authentication)
router.post('/', auth, createPost);
router.post('/:id/reply', auth, replyToPost);

export default router;
