import { body } from 'express-validator';

export const createJournalValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be 3-200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 50000 })
    .withMessage('Content must be 10-50000 characters'),

  body('mood')
    .optional()
    .isIn(['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
    .withMessage('Invalid mood value'),

  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be boolean'),
];

export const updateJournalValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be 3-200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage('Content must be 10-50000 characters'),
];