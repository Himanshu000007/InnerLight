import express from 'express';
import * as moodController from '../controllers/moodController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All mood routes are protected
router.post('/log', auth, moodController.logMood);
router.get('/history', auth, moodController.getMoodHistory);
router.get('/stats', auth, moodController.getMoodStats);

export default router;
