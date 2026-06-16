import { body } from 'express-validator';

export const createPostValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be 10-5000 characters'),

  body('category')
    .optional()
    .isIn(['advice', 'experience', 'question', 'support', 'celebration'])
    .withMessage('Invalid category'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be boolean'),
];

export const updatePostValidator = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be 10-5000 characters'),
];

export const createReplyValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 3, max: 2000 })
    .withMessage('Content must be 3-2000 characters'),

  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be boolean'),
];