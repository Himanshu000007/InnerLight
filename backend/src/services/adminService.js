import { UserRepository } from '../repositories/userRepository.js';
import { ReportRepository } from '../repositories/reportRepository.js';
import { PostRepository } from '../repositories/postRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';

const userRepository = new UserRepository();
const reportRepository = new ReportRepository();
const postRepository = new PostRepository();
const contactRepository = new ContactRepository();

export class AdminService {
  async getDashboardStats() {
    try {
      const totalUsers = await userRepository.countDocuments?.();
      const pendingReports = await reportRepository.countDocuments?.({
        status: 'pending',
      });
      const unreadContacts = await contactRepository.countDocuments?.({
        status: 'new',
      });

      return {
        totalUsers: totalUsers || 0,
        pendingReports: pendingReports || 0,
        unreadContacts: unreadContacts || 0,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  async manageUser(userId, action, reason = '') {
    try {
      if (action === 'suspend') {
        return await userRepository.update(userId, { isActive: false });
      } else if (action === 'activate') {
        return await userRepository.update(userId, { isActive: true });
      } else if (action === 'delete') {
        return await userRepository.delete(userId);
      }
    } catch (error) {
      console.error('Error managing user:', error);
      throw error;
    }
  }

  async moderatePost(postId, action, reason = '') {
    try {
      if (action === 'remove') {
        return await postRepository.update(postId, { isArchived: true });
      }
    } catch (error) {
      console.error('Error moderating post:', error);
      throw error;
    }
  }

  async getSystemStats() {
    try {
      return {
        activeUsers: 0,
        totalPosts: 0,
        totalJournals: 0,
        totalMoods: 0,
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }
}