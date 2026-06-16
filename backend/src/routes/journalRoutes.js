import express from 'express';
import {
  createJournal,
  getJournals,
  getFavorites,
  searchJournals,
  updateJournal,
  toggleFavorite,
  deleteJournal,
} from '../controllers/journalController.js';
import {
  createJournalValidator,
  updateJournalValidator,
} from '../validators/journalValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createJournalValidator, handleValidationErrors, createJournal);

router.get('/', getJournals);

router.get('/favorites', getFavorites);

router.get('/search', searchJournals);

router.put('/:journalId', updateJournalValidator, handleValidationErrors, updateJournal);

router.put('/:journalId/favorite', toggleFavorite);

router.delete('/:journalId', deleteJournal);

export default router;