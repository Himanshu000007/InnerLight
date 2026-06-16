export const SUCCESS_MESSAGES = {
  // Auth
  SIGNUP_SUCCESS: 'Signup successful. Please verify your email.',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  OTP_SENT: 'OTP sent to email',
  OTP_VERIFIED: 'OTP verified successfully',

  // User
  PROFILE_UPDATED: 'Profile updated successfully',
  AVATAR_UPLOADED: 'Avatar uploaded successfully',
  ACCOUNT_DELETED: 'Account deleted successfully',

  // Mood
  MOOD_CREATED: 'Mood recorded successfully',
  MOOD_UPDATED: 'Mood updated successfully',
  MOOD_DELETED: 'Mood deleted successfully',

  // Journal
  JOURNAL_CREATED: 'Journal entry created successfully',
  JOURNAL_UPDATED: 'Journal updated successfully',
  JOURNAL_DELETED: 'Journal deleted successfully',
  FAVORITE_TOGGLED: 'Favorite toggled successfully',

  // Posts & Replies
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_LIKED: 'Post liked successfully',
  POST_UNLIKED: 'Post unliked successfully',
  POST_BOOKMARKED: 'Post bookmarked successfully',
  BOOKMARK_REMOVED: 'Bookmark removed successfully',

  REPLY_CREATED: 'Reply created successfully',
  REPLY_UPDATED: 'Reply updated successfully',
  REPLY_DELETED: 'Reply deleted successfully',
  REPLY_LIKED: 'Reply liked successfully',
  REPLY_UNLIKED: 'Reply unliked successfully',

  // Contact
  CONTACT_CREATED: 'Message sent successfully',
  CONTACT_UPDATED: 'Contact updated successfully',
  RESPONSE_SENT: 'Response sent successfully',

  // Report
  REPORT_SUBMITTED: 'Report submitted successfully',
  REPORT_REVIEWED: 'Report reviewed successfully',

  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  DATA_FETCHED: 'Data fetched successfully',
};

export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  ACCOUNT_DEACTIVATED: 'Your account has been deactivated',
  INVALID_OTP: 'Invalid OTP',
  OTP_EXPIRED: 'OTP has expired',
  TOO_MANY_OTP_ATTEMPTS: 'Too many incorrect attempts. Please request a new OTP',

  // Password
  INVALID_PASSWORD: 'Current password is incorrect',
  WEAK_PASSWORD: 'Password must contain uppercase, lowercase, and number',

  // Token
  NO_TOKEN_PROVIDED: 'No token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  TOKEN_EXPIRED: 'Token has expired',

  // Authorization
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  UNAUTHORIZED_ACTION: 'You are not authorized to perform this action',

  // Validation
  VALIDATION_FAILED: 'Validation failed',
  INVALID_EMAIL: 'Invalid email format',
  REQUIRED_FIELD: 'This field is required',
  INVALID_INPUT: 'Invalid input provided',

  // Resource
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  DUPLICATE_ENTRY: 'Duplicate entry',

  // Email
  EMAIL_SEND_FAILED: 'Failed to send email',
  INVALID_EMAIL_FORMAT: 'Invalid email format',

  // File Upload
  FILE_UPLOAD_FAILED: 'File upload failed',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds limit',

  // AI
  AI_REQUEST_FAILED: 'Failed to generate response',
  AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable',

  // Server
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  DATABASE_ERROR: 'Database operation failed',
};

export default {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};