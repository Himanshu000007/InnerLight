import express from 'express';
import { signup, login, getMe, sendOtp, verifyOtp } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Authentication Routes
 *
 * POST /api/auth/send-otp  - Send OTP to email (step 1 of signup)
 * POST /api/auth/verify-otp - Verify OTP (step 2 of signup)
 * POST /api/auth/signup    - Register new user (step 3, requires valid OTP)
 * POST /api/auth/login     - Login user
 * GET  /api/auth/me        - Get current user (protected)
 */

// OTP routes (for signup flow)
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/me', auth, getMe);

export default router;
