import { UserService } from '../services/userService.js';

const userService = new UserService();

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.getUserProfile(userId);

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.updateProfile(userId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const result = await userService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const avatarData = req.body;

    const result = await userService.uploadAvatar(userId, avatarData);

    res.status(200).json({
      status: 'success',
      message: result.message,
      avatar: result.avatar,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await userService.deleteAccount(userId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getAllUsers(page, limit);

    res.status(200).json({
      status: 'success',
      data: result.users,
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

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term is required',
      });
    }

    const result = await userService.searchUsers(q, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.users,
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