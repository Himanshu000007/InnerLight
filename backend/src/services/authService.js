import { UserRepository } from '../repositories/userRepository.js';
import { OTPRepository } from '../repositories/otpRepository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../config/jwt.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import crypto from 'crypto';

const userRepository = new UserRepository();
const otpRepository = new OTPRepository();

export class AuthService {
  async generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationOTP(email, name) {
    try {
      const otp = await this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await otpRepository.deleteByEmail(email);

      await otpRepository.create({
        email,
        otp,
        type: 'email_verification',
        expiresAt,
      });

      const html = emailTemplates.otpVerification(otp, name);
      await sendEmail(email, 'Verify Your Email - InnerLight', html);

      return {
        success: true,
        message: 'OTP sent to email',
        expiresAt,
      };
    } catch (error) {
      console.error('Error sending verification OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOTP(email, otp, type = 'email_verification') {
    try {
      const otpRecord = await otpRepository.findByEmailAndOTP(email, otp);

      if (!otpRecord) {
        throw new Error('Invalid OTP');
      }

      if (otpRecord.isExpired()) {
        throw new Error('OTP has expired');
      }

      if (otpRecord.isLocked()) {
        throw new Error('Too many incorrect attempts. Please request a new OTP');
      }

      if (otpRecord.type !== type) {
        throw new Error('Invalid OTP type');
      }

      await otpRepository.markAsUsed(otpRecord._id);

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      const otpRecord = await otpRepository.findByEmailAndOTP(email, otp);
      if (otpRecord) {
        await otpRepository.incrementAttempts(otpRecord._id);
      }
      throw error;
    }
  }

  async signup(userData) {
    try {
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = await userRepository.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      // const html = emailTemplates.welcome(userData.firstName);
      // await sendEmail(
      //   user.email,
      //   'Welcome to InnerLight!',
      //   html
      // );

      return {
        success: true,
        message: 'Signup successful. Please verify your email.',
        userId: user._id,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async verifyEmail(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      await userRepository.update(user._id, { isEmailVerified: true });

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await userRepository.findByEmailWithPassword(email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      if (!user.isEmailVerified) {
        throw new Error('Please verify your email before logging in');
      }

      if (!user.isActive) {
        throw new Error('Your account has been deactivated');
      }

      await userRepository.updateLastLogin(user._id);

      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      return {
        success: true,
        message: 'Login successful',
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = generateAccessToken(user._id, user.role);

      return {
        success: true,
        accessToken: newAccessToken,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const otp = await this.generateOTP();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await otpRepository.deleteByEmail(email);

      await otpRepository.create({
        email,
        otp,
        type: 'password_reset',
        expiresAt,
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?otp=${otp}&email=${email}`;
      const html = emailTemplates.passwordReset(resetLink, user.firstName);
      await sendEmail(email, 'Reset Your Password - InnerLight', html);

      return {
        success: true,
        message: 'Password reset instructions sent to email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      await this.verifyOTP(email, otp, 'password_reset');

      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      await userRepository.update(user._id, { password: newPassword });

      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}