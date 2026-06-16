import express from 'express';
import {
  createMood,
  getMoodHistory,
  getMoodAnalytics,
  getMoodTrend,
  updateMood,
  deleteMood,
} from '../controllers/moodController.js';
import { createMoodValidator, updateMoodValidator } from '../validators/moodValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createMoodValidator, handleValidationErrors, createMood);

router.get('/history', getMoodHistory);

router.get('/analytics', getMoodAnalytics);

router.get('/trend', getMoodTrend);

router.put('/:moodId', updateMoodValidator, handleValidationErrors, updateMood);

router.delete('/:moodId', deleteMood);

export default router;