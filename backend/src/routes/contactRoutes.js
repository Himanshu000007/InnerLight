import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  respondToContact,
} from '../controllers/contactController.js';
import { contactValidator } from '../validators/userValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', contactValidator, handleValidationErrors, createContact);

router.use(authenticate);

router.get('/', authorize('admin', 'moderator'), getContacts);

router.get('/:contactId', getContactById);

router.put('/:contactId', authorize('admin', 'moderator'), updateContact);

router.post('/:contactId/respond', authorize('admin', 'moderator'), respondToContact);

export default router;