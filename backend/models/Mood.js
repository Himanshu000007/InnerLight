import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true // emoji representation (e.g., '😊')
    },
    label: {
        type: String,
        required: true // text representation (e.g., 'Happy')
    },
    note: {
        type: String,
        trim: true,
        maxLength: 200
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure only one mood entry per day per user (optional, but good for tracking)
// We'll calculate the start and end of the day for this logic if needed.

export default mongoose.model('Mood', moodSchema);
