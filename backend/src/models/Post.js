import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ['advice', 'experience', 'question', 'support', 'celebration'],
      default: 'experience',
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reason: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient querying
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export default mongoose.model('Post', postSchema);