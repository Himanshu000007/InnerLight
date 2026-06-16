import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export const generateAccessToken = (userId, role = 'user') => {
  try {
    return jwt.sign(
      { userId, role },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRY }
    );
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

export const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { userId },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw error;
  }
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    console.error('Error verifying access token:', error.message);
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    console.error('Error verifying refresh token:', error.message);
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};