import mongoose from 'mongoose';

/**
 * Reply Model
 * 
 * Stores anonymous replies to posts.
 * userId is stored but never exposed in API responses.
 * 
 * Fields:
 * - content: The reply text
 * - postId: Reference to the parent Post
 * - userId: Reference to User (hidden from public API)
 * - createdAt: Timestamp
 */
const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    trim: true,
    maxlength: [1000, 'Reply cannot exceed 1000 characters'],
    minlength: [5, 'Reply must be at least 5 characters']
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries (get replies for a post)
replySchema.index({ postId: 1, createdAt: 1 });

// Create and export the model
const Reply = mongoose.model('Reply', replySchema);

export default Reply;
