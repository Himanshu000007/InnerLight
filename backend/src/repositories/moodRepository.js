import Mood from '../models/Mood.js';

export class MoodRepository {
  async create(moodData) {
    const mood = new Mood(moodData);
    return await mood.save();
  }

  async findById(id) {
    return await Mood.findById(id);
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Mood.countDocuments({ userId });
    const moods = await Mood.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      moods,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByUserIdAndDateRange(userId, startDate, endDate) {
    return await Mood.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Mood.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Mood.findByIdAndDelete(id);
  }

  async getAnalytics(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await Mood.find({
      userId,
      createdAt: { $gte: startDate },
    });

    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const averageScore =
      moods.length > 0
        ? (
            moods.reduce((sum, mood) => sum + mood.moodScore, 0) / moods.length
          ).toFixed(2)
        : 0;

    return {
      totalEntries: moods.length,
      moodCounts,
      averageScore,
      moods,
    };
  }

  async getMoodTrend(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Mood.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          averageScore: { $avg: '$moodScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}