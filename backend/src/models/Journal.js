import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    mood: {
      type: String,
      enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
      default: null,
    },
    tags: [String],
    isPrivate: {
      type: Boolean,
      default: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
journalSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Journal', journalSchema);