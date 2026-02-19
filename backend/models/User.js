import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * 
 * Stores user authentication information.
 * Password is hashed using bcrypt before saving.
 * 
 * Fields:
 * - name: User's name (for admin reference only, not shown in anonymous posts)
 * - email: Unique email for login
 * - password: Hashed password (never stored in plain text)
 * - createdAt: Timestamp
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Pre-save hook: Hash password before saving
 * 
 * This runs automatically before saving a user document.
 * It checks if the password was modified, and if so, hashes it.
 * 
 * bcrypt.hash() takes:
 * - The password string
 * - Salt rounds (10 = good balance of security and speed)
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare password
 * 
 * Used during login to verify if provided password matches stored hash.
 * 
 * Usage: const isMatch = await user.comparePassword(plainPassword);
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
