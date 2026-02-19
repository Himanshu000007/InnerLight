import mongoose from 'mongoose';

/**
 * OTP Model
 *
 * Stores one-time passwords for email verification during signup.
 * Each OTP auto-expires after 10 minutes via MongoDB TTL index.
 *
 * Fields:
 * - email: The email address the OTP was sent to
 * - otp: The hashed 6-digit OTP
 * - createdAt: Timestamp (used by TTL index)
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Auto-delete after 10 minutes (600 seconds)
    },
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
