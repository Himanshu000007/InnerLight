import { AuthService } from '../services/authService.js';

const authService = new AuthService();

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const result = await authService.signup({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      status: 'success',
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    next(error);
  }
};

export const sendVerificationOTP = async (req, res, next) => {
  try {
    const { email, firstName } = req.body;

    const result = await authService.sendVerificationOTP(email, firstName);

    res.status(200).json({
      status: 'success',
      message: result.message,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    await authService.verifyOTP(email, otp, 'email_verification');
    await authService.verifyEmail(email);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: 'success',
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const result = await authService.resetPassword(email, otp, newPassword);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};