import { JournalRepository } from '../repositories/journalRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

const journalRepository = new JournalRepository();
const userRepository = new UserRepository();

export class JournalService {
  async createJournal(userId, journalData) {
    try {
      const journal = await journalRepository.create({
        userId,
        ...journalData,
      });

      await userRepository.incrementStatistics(userId, 'totalJournalEntries');

      return journal;
    } catch (error) {
      console.error('Error creating journal:', error);
      throw error;
    }
  }

  async getJournals(userId, page = 1, limit = 10) {
    try {
      return await journalRepository.findByUserId(userId, page, limit);
    } catch (error) {
      console.error('Error fetching journals:', error);
      throw error;
    }
  }

  async getFavorites(userId, page = 1, limit = 10) {
    try {
      return await journalRepository.findByUserIdAndFavorite(userId, page, limit);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async searchJournals(userId, searchTerm, page = 1, limit = 10) {
    try {
      return await journalRepository.search(userId, searchTerm, page, limit);
    } catch (error) {
      console.error('Error searching journals:', error);
      throw error;
    }
  }

  async updateJournal(journalId, updateData) {
    try {
      return await journalRepository.update(journalId, updateData);
    } catch (error) {
      console.error('Error updating journal:', error);
      throw error;
    }
  }

  async toggleFavorite(journalId) {
    try {
      return await journalRepository.toggleFavorite(journalId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async deleteJournal(userId, journalId) {
    try {
      await journalRepository.delete(journalId);
      await userRepository.decrementStatistics(userId, 'totalJournalEntries');

      return {
        success: true,
        message: 'Journal deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  }
}