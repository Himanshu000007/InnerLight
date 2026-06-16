import crypto from 'crypto';

/**
 * Generate random string
 */
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Calculate days difference
 */
export const daysDifference = (date1, date2) => {
  const time = date2.getTime() - date1.getTime();
  return Math.floor(time / (1000 * 3600 * 24));
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    pagination: {
      total: array.length,
      page,
      limit,
      pages: Math.ceil(array.length / limit),
    },
  };
};

/**
 * Filter object by keys
 */
export const filterObject = (obj, keys) => {
  const filtered = {};
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Check if password is strong
 */
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
};

/**
 * Sanitize string (remove special characters)
 */
export const sanitizeString = (str) => {
  return str.replace(/[^\w\s]/gi, '');
};

/**
 * Truncate string
 */
export const truncateString = (str, length = 100) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if URL is valid
 */
export const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Wait for specified milliseconds
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Convert array to object by key
 */
export const arrayToObject = (array, key) => {
  return array.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

/**
 * Merge objects
 */
export const mergeObjects = (...objects) => {
  return Object.assign({}, ...objects);
};