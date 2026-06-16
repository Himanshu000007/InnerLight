import { ReportRepository } from '../repositories/reportRepository.js';
import { PostRepository } from '../repositories/postRepository.js';
import { ReplyRepository } from '../repositories/replyRepository.js';

const reportRepository = new ReportRepository();
const postRepository = new PostRepository();
const replyRepository = new ReplyRepository();

export class ReportService {
  async createReport(reportData) {
    try {
      const report = await reportRepository.create(reportData);

      if (reportData.postId) {
        await postRepository.addReport(reportData.postId, {
          userId: reportData.reporterId,
          reason: reportData.reason,
          createdAt: new Date(),
        });
      }

      return {
        success: true,
        message: 'Report submitted successfully',
        reportId: report._id,
      };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async getReports(page = 1, limit = 10, filters = {}) {
    try {
      return await reportRepository.findAll(page, limit, filters);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReportById(reportId) {
    try {
      return await reportRepository.findById(reportId);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async getReportsByStatus(status, page = 1, limit = 10) {
    try {
      return await reportRepository.findByStatus(status, page, limit);
    } catch (error) {
      console.error('Error fetching reports by status:', error);
      throw error;
    }
  }

  async updateReport(reportId, updateData) {
    try {
      return await reportRepository.update(reportId, updateData);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async reviewReport(reportId, action, adminNotes, adminId) {
    try {
      return await reportRepository.update(reportId, {
        status: 'under_review',
        actionTaken: action,
        adminNotes,
        reviewedBy: adminId,
      });
    } catch (error) {
      console.error('Error reviewing report:', error);
      throw error;
    }
  }
}