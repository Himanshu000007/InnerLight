import { body, param, query, validationResult } from 'express-validator';

/**
 * Pagination validators
 */
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * MongoDB ID validator
 */
export const mongoIdValidator = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format'),
];

export const mongoIdBodyValidator = (fieldName = 'id') => [
  body(fieldName)
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format'),
];

/**
 * Search query validator
 */
export const searchValidator = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search term is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be 2-100 characters'),
];

/**
 * Date range validator
 */
export const dateRangeValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
];

/**
 * Filter validator
 */
export const filterValidator = [
  query('filter')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid filter'),
];

/**
 * Tags validator
 */
export const tagsValidator = [
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be 1-50 characters'),
];

/**
 * Status validator
 */
export const statusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'in_progress', 'resolved', 'closed', 'new', 'under_review', 'dismissed'])
    .withMessage('Invalid status value'),
];

/**
 * Priority validator
 */
export const priorityValidator = [
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
];

/**
 * Category validator
 */
export const categoryValidator = [
  body('category')
    .optional()
    .isIn([
      'bug_report',
      'feature_request',
      'feedback',
      'other',
      'advice',
      'experience',
      'question',
      'support',
      'celebration',
    ])
    .withMessage('Invalid category'),
];

/**
 * Reason validator
 */
export const reasonValidator = [
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isIn(['inappropriate', 'spam', 'harassment', 'hate_speech', 'self_harm', 'other'])
    .withMessage('Invalid reason'),
];

/**
 * Action validator
 */
export const actionValidator = [
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['suspend', 'activate', 'delete', 'warning', 'remove', 'content_removed', 'account_suspended'])
    .withMessage('Invalid action'),
];

/**
 * Notes validator
 */
export const notesValidator = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
];

/**
 * Boolean validator
 */
export const booleanValidator = (fieldName) => [
  body(fieldName)
    .optional()
    .isBoolean()
    .withMessage(`${fieldName} must be a boolean`),
];

/**
 * Email in body validator
 */
export const emailBodyValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
];

/**
 * Custom error formatter
 */
export const formatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};