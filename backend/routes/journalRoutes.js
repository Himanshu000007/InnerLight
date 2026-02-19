import express from 'express';
import { createJournalEntry, getJournalEntries, getJournalEntryById } from '../controllers/journalController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Journal Routes
 * 
 * All routes are protected (require authentication)
 * 
 * POST   /api/journal - Create a new journal entry
 * GET    /api/journal - Get all journal entries for current user
 * GET    /api/journal/:id - Get a single journal entry
 */

// All routes require authentication
router.use(auth); // Apply auth middleware to all routes

router.post('/', createJournalEntry);
router.get('/', getJournalEntries);
router.get('/:id', getJournalEntryById);

export default router;
