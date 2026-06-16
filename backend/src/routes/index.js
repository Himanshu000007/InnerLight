import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import moodRoutes from './moodRoutes.js';
import journalRoutes from './journalRoutes.js';
import postRoutes from './postRoutes.js';
// import replyRoutes from './replyRoutes.js';
import contactRoutes from './contactRoutes.js';
import reportRoutes from './reportRoutes.js';
import aiRoutes from './aiRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/moods', moodRoutes);
router.use('/journals', journalRoutes);
router.use('/posts', postRoutes);
// router.use('/replies', replyRoutes);
router.use('/contacts', contactRoutes);
router.use('/reports', reportRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;