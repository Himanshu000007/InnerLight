import { MoodService } from '../services/moodService.js';

const moodService = new MoodService();

export const createMood = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const mood = await moodService.createMood(userId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Mood recorded successfully',
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await moodService.getMoodHistory(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.moods,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    const result = await moodService.getMoodAnalytics(userId, days);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodTrend = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 7;

    const result = await moodService.getMoodTrend(userId, days);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMood = async (req, res, next) => {
  try {
    const { moodId } = req.params;
    const mood = await moodService.updateMood(moodId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Mood updated successfully',
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMood = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { moodId } = req.params;

    const result = await moodService.deleteMood(userId, moodId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};