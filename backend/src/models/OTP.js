import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto delete OTP after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if OTP is expired
otpSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Check if OTP attempts exceeded
otpSchema.methods.isLocked = function () {
  return this.attempts >= this.maxAttempts;
};

export default mongoose.model('OTP', otpSchema);