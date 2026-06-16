import { ReportService } from '../services/reportService.js';

const reportService = new ReportService();

export const createReport = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await reportService.createReport({
      reporterId: userId,
      ...req.body,
    });

    res.status(201).json({
      status: 'success',
      message: result.message,
      reportId: result.reportId,
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const filters = {};
    if (status) filters.status = status;

    const result = await reportService.getReports(page, limit, filters);

    res.status(200).json({
      status: 'success',
      data: result.reports,
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

export const getReportById = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.getReportById(reportId);

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewReport = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { reportId } = req.params;
    const { action, adminNotes } = req.body;

    const report = await reportService.reviewReport(
      reportId,
      action,
      adminNotes,
      adminId
    );

    res.status(200).json({
      status: 'success',
      message: 'Report reviewed successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};