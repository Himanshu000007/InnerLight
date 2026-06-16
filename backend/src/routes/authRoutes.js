import express from 'express';
import {
  signup,
  sendVerificationOTP,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  signupValidator,
  loginValidator,
  otpValidator,
  resetPasswordValidator,
  sendOTPValidator,
} from '../validators/authValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, signupValidator, handleValidationErrors, signup);

router.post(
  '/send-otp',
  authLimiter,
  sendOTPValidator,
  handleValidationErrors,
  sendVerificationOTP
);

router.post(
  '/verify-email',
  authLimiter,
  otpValidator,
  handleValidationErrors,
  verifyEmail
);

router.post('/login', authLimiter, loginValidator, handleValidationErrors, login);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', logout);

router.post(
  '/forgot-password',
  authLimiter,
  sendOTPValidator,
  handleValidationErrors,
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  resetPasswordValidator,
  handleValidationErrors,
  resetPassword
);

export default router;