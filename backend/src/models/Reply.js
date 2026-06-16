import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
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
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
replySchema.index({ postId: 1, createdAt: -1 });
replySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Reply', replySchema);