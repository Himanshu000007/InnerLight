import { MoodRepository } from '../repositories/moodRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

const moodRepository = new MoodRepository();
const userRepository = new UserRepository();

export class MoodService {
  async createMood(userId, moodData) {
    try {
      const mood = await moodRepository.create({
        userId,
        ...moodData,
      });

      await userRepository.incrementStatistics(userId, 'totalMoods');

      return mood;
    } catch (error) {
      console.error('Error creating mood:', error);
      throw error;
    }
  }

  async getMoodHistory(userId, page = 1, limit = 10) {
    try {
      return await moodRepository.findByUserId(userId, page, limit);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      throw error;
    }
  }

  async getMoodAnalytics(userId, days = 30) {
    try {
      return await moodRepository.getAnalytics(userId, days);
    } catch (error) {
      console.error('Error fetching mood analytics:', error);
      throw error;
    }
  }

  async getMoodTrend(userId, days = 7) {
    try {
      return await moodRepository.getMoodTrend(userId, days);
    } catch (error) {
      console.error('Error fetching mood trend:', error);
      throw error;
    }
  }

  async updateMood(moodId, updateData) {
    try {
      return await moodRepository.update(moodId, updateData);
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  }

  async deleteMood(userId, moodId) {
    try {
      await moodRepository.delete(moodId);
      await userRepository.decrementStatistics(userId, 'totalMoods');

      return {
        success: true,
        message: 'Mood deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  }
}