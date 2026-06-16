import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAccount,
  getAllUsers,
  searchUsers,
} from '../controllers/userController.js';
import {
  updateProfileValidator,
  changePasswordValidator,
} from '../validators/userValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);

router.put('/profile', updateProfileValidator, handleValidationErrors, updateProfile);

router.post('/change-password', changePasswordValidator, handleValidationErrors, changePassword);

router.post('/upload-avatar', uploadAvatar);

router.delete('/account', deleteAccount);

router.get('/all', getAllUsers);

router.get('/search', searchUsers);

export default router;