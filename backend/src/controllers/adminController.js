import { AdminService } from '../services/adminService.js';

const adminService = new AdminService();

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    const stats = await adminService.getSystemStats();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const manageUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body;

    const result = await adminService.manageUser(userId, action, reason);

    res.status(200).json({
      status: 'success',
      message: `User ${action}ed successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const moderatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { action, reason } = req.body;

    const result = await adminService.moderatePost(postId, action, reason);

    res.status(200).json({
      status: 'success',
      message: `Post ${action}ed successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};