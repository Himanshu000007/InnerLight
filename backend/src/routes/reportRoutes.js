import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  reviewReport,
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createReport);

router.get('/', authorize('admin', 'moderator'), getReports);

router.get('/:reportId', getReportById);

router.put('/:reportId/review', authorize('admin', 'moderator'), reviewReport);

export default router;