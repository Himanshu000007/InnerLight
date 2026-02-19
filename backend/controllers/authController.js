import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Create nodemailer transporter using Gmail
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email for signup verification
 * @access  Public
 *
 * Steps:
 * 1. Validate email
 * 2. Check if email is already registered
 * 3. Generate 6-digit OTP
 * 4. Hash and save OTP to DB (replaces any existing OTP for this email)
 * 5. Send OTP via email
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Delete any existing OTP for this email, then save new one
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: hashedOtp });

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"InnerLight 🌿" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your InnerLight Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #6c63ff; margin-bottom: 8px;">InnerLight 🌿</h2>
          <p style="color: #444; font-size: 16px;">Your email verification code is:</p>
          <div style="background: #6c63ff; color: white; font-size: 36px; font-weight: bold; letter-spacing: 10px; text-align: center; padding: 20px; border-radius: 8px; margin: 24px 0;">
            ${otpCode}
          </div>
          <p style="color: #888; font-size: 14px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent to your email. Please check your inbox.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.', error: error.message });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP entered by user
 * @access  Public
 *
 * Steps:
 * 1. Find OTP record for this email
 * 2. Compare provided OTP with stored hash
 * 3. Return success (OTP is valid) — actual account creation happens in /signup
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find the OTP record
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    // Compare OTP
    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification', error: error.message });
  }
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (only after OTP is verified)
 * @access  Public
 *
 * Steps:
 * 1. Validate input (name, email, password, otp)
 * 2. Verify OTP one final time
 * 3. Check if user already exists
 * 4. Create new user
 * 5. Delete the used OTP
 * 6. Return success message (NO token — user must login separately)
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Validation
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        message: 'Please provide name, email, password, and OTP'
      });
    }

    // Verify OTP before creating account
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create new user (password hashed by pre-save hook)
    await User.create({ name, email, password });

    // Delete the used OTP
    await Otp.deleteMany({ email });

    // Return success — NO token, user must login manually
    res.status(201).json({
      message: 'Account created successfully! Please log in to continue.',
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({
      message: 'Server error during signup',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
