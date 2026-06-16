import { body } from 'express-validator';

export const createMoodValidator = [
  body('mood')
    .notEmpty()
    .withMessage('Mood is required')
    .isIn(['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
    .withMessage('Invalid mood value'),

  body('moodScore')
    .notEmpty()
    .withMessage('Mood score is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),

  body('intensity')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid intensity value'),

  body('trigger')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Trigger must not exceed 500 characters'),

  body('energy')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy must be between 1 and 10'),

  body('sleep')
    .optional()
    .isInt({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
];

export const updateMoodValidator = [
  body('mood')
    .optional()
    .isIn(['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
    .withMessage('Invalid mood value'),

  body('moodScore')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),
];