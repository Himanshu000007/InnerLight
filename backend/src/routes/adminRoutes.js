import express from 'express';
import {
  getDashboardStats,
  getSystemStats,
  manageUser,
  moderatePost,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/stats', getSystemStats);

router.put('/users/:userId', manageUser);

router.put('/posts/:postId/moderate', moderatePost);

export default router;