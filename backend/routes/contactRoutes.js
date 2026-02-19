import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

/**
 * Contact Routes
 * 
 * POST   /api/contact - Submit contact form (public)
 */

router.post('/', submitContact);

export default router;
