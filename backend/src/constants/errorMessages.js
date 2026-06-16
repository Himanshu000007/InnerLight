export const AUTH_ERRORS = {
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Invalid credentials.',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed.',
  PASSWORD_RESET_FAILED: 'Password reset failed.',
  OTP_VERIFICATION_FAILED: 'OTP verification failed.',
  TOKEN_GENERATION_FAILED: 'Token generation failed.',
  REFRESH_TOKEN_FAILED: 'Failed to refresh token.',
};

export const VALIDATION_ERRORS = {
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters with uppercase, lowercase, and number',
  INVALID_OTP: 'OTP must be 6 digits',
  INVALID_NAME: 'Name must be between 2 and 50 characters',
  INVALID_BIO: 'Bio must not exceed 500 characters',
  INVALID_TITLE: 'Title must be between 3 and 200 characters',
  INVALID_CONTENT: 'Content must be between 10 and 5000 characters',
  INVALID_MOOD: 'Invalid mood value',
  INVALID_MOOD_SCORE: 'Mood score must be between 1 and 5',
  INVALID_ENERGY: 'Energy must be between 1 and 10',
  INVALID_SLEEP: 'Sleep hours must be between 0 and 24',
};

export const RESOURCE_ERRORS = {
  USER_NOT_FOUND: 'User not found',
  MOOD_NOT_FOUND: 'Mood entry not found',
  JOURNAL_NOT_FOUND: 'Journal entry not found',
  POST_NOT_FOUND: 'Post not found',
  REPLY_NOT_FOUND: 'Reply not found',
  CONTACT_NOT_FOUND: 'Contact message not found',
  REPORT_NOT_FOUND: 'Report not found',
};

export const AUTHORIZATION_ERRORS = {
  NOT_AUTHENTICATED: 'Please log in to continue',
  NOT_AUTHORIZED: 'You do not have permission to perform this action',
  FORBIDDEN: 'Access forbidden',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
};

export default {
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  RESOURCE_ERRORS,
  AUTHORIZATION_ERRORS,
};