import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * Sign JWT token
 */
export const signToken = (payload, secret, expiresIn) => {
  try {
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    console.error('Error signing token:', error);
    throw new Error('Failed to sign token');
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification
 */
export const decodeTokenNoVerify = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiry time
 */
export const getTokenExpiryTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};