import { AIService } from '../services/aiService.js';

const aiService = new AIService();

export const getWellnessResponse = async (req, res, next) => {
  try {
    const { prompt, context } = req.body;

    const result = await aiService.getWellnessResponse(prompt, context);

    res.status(200).json({
      status: 'success',
      data: {
        response: result.response,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBreathingExercise = async (req, res, next) => {
  try {
    const { duration, focusArea } = req.body;

    const result = await aiService.getBreathingExercise(
      duration || 5,
      focusArea || 'general'
    );

    res.status(200).json({
      status: 'success',
      data: {
        exercise: result.exercise,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodInsight = async (req, res, next) => {
  try {
    const { moodHistory } = req.body;

    const result = await aiService.getMoodInsight(moodHistory);

    res.status(200).json({
      status: 'success',
      data: {
        insight: result.insight,
      },
    });
  } catch (error) {
    next(error);
  }
};