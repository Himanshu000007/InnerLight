import Journal from '../models/Journal.js';

/**
 * @route   POST /api/journal
 * @desc    Create a new journal entry
 * @access  Private (requires auth middleware)
 * 
 * Creates a private journal entry for the authenticated user.
 * Only the user who created it can see it.
 */
export const createJournalEntry = async (req, res) => {
  try {
    const { mood, note } = req.body;

    // Validation
    if (!mood || !note) {
      return res.status(400).json({ 
        message: 'Please provide mood and note' 
      });
    }

    const validMoods = ['Happy', 'Calm', 'Anxious', 'Stressed'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ 
        message: `Mood must be one of: ${validMoods.join(', ')}` 
      });
    }

    if (note.trim().length < 1) {
      return res.status(400).json({ 
        message: 'Journal note cannot be empty' 
      });
    }

    // Create journal entry
    // req.user is set by auth middleware
    const journalEntry = await Journal.create({
      mood,
      note: note.trim(),
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry: {
        id: journalEntry._id,
        mood: journalEntry.mood,
        note: journalEntry.note,
        createdAt: journalEntry.createdAt
      }
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      message: 'Server error creating journal entry', 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/journal
 * @desc    Get all journal entries for current user
 * @access  Private (requires auth middleware)
 * 
 * Returns all journal entries for the authenticated user.
 * Sorted by newest first.
 */
export const getJournalEntries = async (req, res) => {
  try {
    // Get all journal entries for the current user
    // req.user is set by auth middleware
    const entries = await Journal.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .select('-userId'); // Exclude userId (redundant since we filtered by it)

    res.status(200).json({
      message: 'Journal entries retrieved successfully',
      entries,
      count: entries.length
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ 
      message: 'Server error fetching journal entries', 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/journal/:id
 * @desc    Get a single journal entry
 * @access  Private (requires auth middleware)
 * 
 * Returns a specific journal entry.
 * Only if it belongs to the authenticated user.
 */
export const getJournalEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find journal entry
    const entry = await Journal.findById(id);

    if (!entry) {
      return res.status(404).json({ 
        message: 'Journal entry not found' 
      });
    }

    // Check if entry belongs to current user
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. This journal entry does not belong to you.' 
      });
    }

    res.status(200).json({
      message: 'Journal entry retrieved successfully',
      entry: {
        id: entry._id,
        mood: entry.mood,
        note: entry.note,
        createdAt: entry.createdAt
      }
    });
  } catch (error) {
    console.error('Get journal entry by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid journal entry ID' 
      });
    }

    res.status(500).json({ 
      message: 'Server error fetching journal entry', 
      error: error.message 
    });
  }
};
