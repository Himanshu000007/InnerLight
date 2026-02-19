import Mood from '../models/Mood.js';

// Log a new mood
export const logMood = async (req, res) => {
    try {
        const { mood, label, note } = req.body;

        // Check if user already logged mood today (optional, but good for data quality)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // If you want to limit to one per day, uncomment this:
        /*
        const existingMood = await Mood.findOne({
          user: req.user.id,
          date: { $gte: today, $lt: tomorrow }
        });
        if (existingMood) {
          return res.status(400).json({ message: 'You have already logged your mood for today.' });
        }
        */

        const newMood = new Mood({
            user: req.user._id, // Use _id from auth middleware
            mood,
            label,
            note
        });

        await newMood.save();
        res.status(201).json({ message: 'Mood logged successfully', mood: newMood });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get mood history for a user
export const getMoodHistory = async (req, res) => {
    try {
        const history = await Mood.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(30); // Last 30 days
        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get stats (e.g., mood distribution)
export const getMoodStats = async (req, res) => {
    try {
        const stats = await Mood.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$label', count: { $sum: 1 }, emoji: { $first: '$mood' } } }
        ]);
        res.json({ stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
