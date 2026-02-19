import mongoose from 'mongoose';

/**
 * Journal Model
 * 
 * Stores private journal entries for authenticated users.
 * Only the user who created the entry can see it.
 * 
 * Fields:
 * - userId: Reference to User (required for privacy)
 * - mood: Selected mood (Happy, Calm, Anxious, Stressed)
 * - note: Journal entry text
 * - createdAt: Timestamp
 */
const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: {
      values: ['Happy', 'Calm', 'Anxious', 'Stressed'],
      message: 'Mood must be one of: Happy, Calm, Anxious, Stressed'
    }
  },
  note: {
    type: String,
    required: [true, 'Journal note is required'],
    trim: true,
    maxlength: [5000, 'Journal entry cannot exceed 5000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries (get user's journal entries sorted by newest)
journalSchema.index({ userId: 1, createdAt: -1 });

// Create and export the model
const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
