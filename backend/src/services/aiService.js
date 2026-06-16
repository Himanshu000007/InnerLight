import {
  generateWellnessResponse,
  generateBreathingExercise,
  generateMoodInsight,
} from '../config/gemini.js';

export class AIService {
  async getWellnessResponse(userPrompt, userContext = '') {
    try {
      const response = await generateWellnessResponse(userPrompt, userContext);
      return {
        success: true,
        response,
      };
    } catch (error) {
      console.error('Error getting wellness response:', error);
      throw error;
    }
  }

  async getBreathingExercise(duration = 5, focusArea = 'general') {
    try {
      const exercise = await generateBreathingExercise(duration, focusArea);
      return {
        success: true,
        exercise,
      };
    } catch (error) {
      console.error('Error generating breathing exercise:', error);
      throw error;
    }
  }

  async getMoodInsight(moodHistory) {
    try {
      const insight = await generateMoodInsight(moodHistory);
      return {
        success: true,
        insight,
      };
    } catch (error) {
      console.error('Error generating mood insight:', error);
      throw error;
    }
  }
}