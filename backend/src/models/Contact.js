import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ['bug_report', 'feature_request', 'feedback', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    response: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

export default mongoose.model('Contact', contactSchema);