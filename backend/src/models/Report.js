import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
      default: null,
    },
    reason: {
      type: String,
      enum: [
        'inappropriate',
        'spam',
        'harassment',
        'hate_speech',
        'self_harm',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'dismissed'],
      default: 'pending',
    },
    actionTaken: {
      type: String,
      enum: ['none', 'warning', 'content_removed', 'account_suspended'],
      default: 'none',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporterId: 1 });

export default mongoose.model('Report', reportSchema);