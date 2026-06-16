import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
      required: true,
    },
    moodScore: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    trigger: {
      type: String,
      default: '',
      maxlength: 500,
    },
    activities: [
      {
        type: String,
        enum: [
          'exercise',
          'work',
          'socializing',
          'rest',
          'eating',
          'creative',
          'learning',
          'other',
        ],
      },
    ],
    notes: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    sleep: {
      type: Number,
      min: 0,
      max: 24,
      default: null,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index for efficient querying
moodSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Mood', moodSchema);