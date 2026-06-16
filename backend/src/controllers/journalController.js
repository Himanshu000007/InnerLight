import { JournalService } from '../services/journalService.js';

const journalService = new JournalService();

export const createJournal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const journal = await journalService.createJournal(userId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Journal entry created successfully',
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const getJournals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await journalService.getJournals(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.journals,
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

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await journalService.getFavorites(userId, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.journals,
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

export const searchJournals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term is required',
      });
    }

    const result = await journalService.searchJournals(userId, q, page, limit);

    res.status(200).json({
      status: 'success',
      data: result.journals,
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

export const updateJournal = async (req, res, next) => {
  try {
    const { journalId } = req.params;
    const journal = await journalService.updateJournal(journalId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Journal updated successfully',
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { journalId } = req.params;
    const journal = await journalService.toggleFavorite(journalId);

    res.status(200).json({
      status: 'success',
      message: 'Favorite toggled successfully',
      data: journal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJournal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { journalId } = req.params;

    const result = await journalService.deleteJournal(userId, journalId);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};