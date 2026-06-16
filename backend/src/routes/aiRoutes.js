import express from 'express';
import {
  getWellnessResponse,
  getBreathingExercise,
  getMoodInsight,
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/wellness', getWellnessResponse);

router.post('/breathing-exercise', getBreathingExercise);

router.post('/mood-insight', getMoodInsight);

export default router;