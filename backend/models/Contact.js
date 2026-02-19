import mongoose from 'mongoose';

/**
 * Contact Model
 * 
 * Stores contact form submissions.
 * Used for users to reach out or report issues.
 * 
 * Fields:
 * - name: Contact person's name
 * - email: Contact email
 * - message: Contact message
 * - createdAt: Timestamp
 */
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    minlength: [10, 'Message must be at least 10 characters']
  }
}, {
  timestamps: true
});

// Create and export the model
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
