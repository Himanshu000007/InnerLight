import Report from '../models/Report.js';

export class ReportRepository {
  async create(reportData) {
    const report = new Report(reportData);
    return await report.save();
  }

  async countDocuments(filters = {}) {
    return await Report.countDocuments(filters);
  }

  async findById(id) {
    return await Report.findById(id)
      .populate('reporterId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email');
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const total = await Report.countDocuments(filters);
    const reports = await Report.find(filters)
      .skip(skip)
      .limit(limit)
      .populate('reporterId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return {
      reports,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByStatus(status, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Report.countDocuments({ status });
    const reports = await Report.find({ status })
      .skip(skip)
      .limit(limit)
      .populate('reporterId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return {
      reports,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByPostId(postId) {
    return await Report.find({ postId });
  }

  async findByReplyId(replyId) {
    return await Report.find({ replyId });
  }

  async update(id, updateData) {
    return await Report.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Report.findByIdAndDelete(id);
  }
}