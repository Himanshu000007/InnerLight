import { UserRepository } from '../repositories/userRepository.js';

const userRepository = new UserRepository();

export class UserService {
  async getUserProfile(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.getPublicProfile();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedFields = [
        'firstName',
        'lastName',
        'bio',
        'avatar',
        'preferences',
      ];
      const filteredData = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      const user = await userRepository.update(userId, filteredData);
      return user.getPublicProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await userRepository.findByIdWithPassword(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.comparePassword(oldPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      await userRepository.update(userId, { password: newPassword });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async uploadAvatar(userId, avatarData) {
    try {
      const user = await userRepository.update(userId, {
        avatar: avatarData,
      });

      return {
        success: true,
        message: 'Avatar uploaded successfully',
        avatar: user.avatar,
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  async deleteAccount(userId) {
    try {
      await userRepository.delete(userId);
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 10) {
    try {
      return await userRepository.findAll(page, limit);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async searchUsers(searchTerm, page = 1, limit = 10) {
    try {
      return await userRepository.search(searchTerm, page, limit);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}