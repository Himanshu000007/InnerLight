import mongoose from 'mongoose';

/**
 * Post Model
 * 
 * Stores anonymous posts shared by users.
 * userId is stored for admin reference but never exposed in API responses.
 * 
 * Fields:
 * - content: The post text (required)
 * - userId: Reference to User (hidden from public API)
 * - createdAt: Timestamp
 */
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [2000, 'Post cannot exceed 2000 characters'],
    minlength: [10, 'Post must be at least 10 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries (get posts sorted by newest)
postSchema.index({ createdAt: -1 });

// Create and export the model
const Post = mongoose.model('Post', postSchema);

export default Post;
