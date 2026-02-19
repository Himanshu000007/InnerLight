import { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smile,
    Frown,
    Meh,
    CloudRain,
    Sun,
    Moon,
    Calendar,
    TrendingUp,
    Plus,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import './MoodTracker.css';

const MoodTracker = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLogForm, setShowLogForm] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const moodOptions = [
        { emoji: '😊', label: 'Happy', color: '#FCD34D' },
        { emoji: '😌', label: 'Calm', color: '#6EE7B7' },
        { emoji: '😐', label: 'Neutral', color: '#93C5FD' },
        { emoji: '😔', label: 'Sad', color: '#A5B4FC' },
        { emoji: '😤', label: 'Anxious', color: '#FCA5A5' },
        { emoji: '😴', label: 'Tired', color: '#D1D5DB' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [historyRes, statsRes] = await Promise.all([
                moodAPI.getMoodHistory(),
                moodAPI.getMoodStats()
            ]);
            setHistory(historyRes.data.history || []);
            setStats(statsRes.data.stats || []);
        } catch (error) {
            console.error('Error fetching mood data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMood) return;

        try {
            setSubmitting(true);
            await moodAPI.logMood({
                mood: selectedMood.emoji,
                label: selectedMood.label,
                note: note.trim()
            });
            setMessage('Mood logged! Your compass is updating...');
            setTimeout(() => {
                setMessage('');
                setShowLogForm(false);
                setSelectedMood(null);
                setNote('');
                fetchData();
            }, 2000);
        } catch (error) {
            console.error('Error logging mood:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mood-container">
            <motion.div
                className="mood-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Mood Compass <TrendingUp size={24} className="header-icon" /></h1>
                <p>Track your emotional weather and find your inner north.</p>
            </motion.div>

            <div className="mood-dashboard">
                <div className="mood-main-sections">
                    {/* Quick Action */}
                    <section className="mood-section quick-log">
                        <button
                            className="btn btn-primary log-trigger-btn"
                            onClick={() => setShowLogForm(true)}
                        >
                            <Plus size={20} /> How are you feeling right now?
                        </button>
                    </section>

                    {/* History */}
                    <section className="mood-section history-section">
                        <div className="section-header">
                            <Calendar size={20} /> <h2>Recent Journey</h2>
                        </div>
                        {loading ? (
                            <div className="mood-loading">Tracing your steps...</div>
                        ) : history.length === 0 ? (
                            <div className="mood-empty">No tracks yet. Log your first mood to begin.</div>
                        ) : (
                            <div className="mood-history-list">
                                {history.map((entry, i) => (
                                    <motion.div
                                        key={entry._id}
                                        className="mood-entry-card glass"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className="entry-mood">{entry.mood}</div>
                                        <div className="entry-details">
                                            <div className="entry-header">
                                                <span className="entry-label">{entry.label}</span>
                                                <span className="entry-time">{formatDate(entry.date)}</span>
                                            </div>
                                            {entry.note && <p className="entry-note">"{entry.note}"</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="mood-sidebar">
                    <section className="mood-section stats-section glass">
                        <div className="section-header">
                            <BarChart3 size={20} /> <h2>Emotional Landscape</h2>
                        </div>
                        {stats.length === 0 ? (
                            <p className="stats-empty">Statistics will appear as you log moods.</p>
                        ) : (
                            <div className="stats-grid">
                                {stats.map((stat) => (
                                    <div key={stat._id} className="stat-card">
                                        <span className="stat-emoji">{stat.emoji}</span>
                                        <span className="stat-count">{stat.count}</span>
                                        <span className="stat-label">{stat._id}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="mood-tip-card glass">
                        <Sun size={24} className="tip-icon" />
                        <h3>Zen Tip</h3>
                        <p>Emotions are like clouds—they pass. Observe them without judgment.</p>
                    </div>
                </aside>
            </div>

            {/* Log Mood Modal */}
            <AnimatePresence>
                {showLogForm && (
                    <motion.div
                        className="mood-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="mood-modal glass"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            {message ? (
                                <div className="mood-success-msg">
                                    <CheckCircle2 size={48} className="success-icon" />
                                    <h2>{message}</h2>
                                </div>
                            ) : (
                                <>
                                    <button className="close-modal" onClick={() => setShowLogForm(false)}>
                                        <CheckCircle2 size={24} style={{ transform: 'rotate(45deg)', color: 'var(--text-light)' }} />
                                    </button>
                                    <h2>Check-in with yourself</h2>
                                    <p>Select the emoji that best represents your current state.</p>

                                    <div className="mood-options-grid">
                                        {moodOptions.map((opt) => (
                                            <button
                                                key={opt.label}
                                                className={`mood-opt-btn ${selectedMood?.label === opt.label ? 'active' : ''}`}
                                                onClick={() => setSelectedMood(opt)}
                                            >
                                                <span className="opt-emoji">{opt.emoji}</span>
                                                <span className="opt-label">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedMood && (
                                        <motion.div
                                            className="mood-note-field"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <textarea
                                                placeholder="Optional: What's making you feel this way?"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                rows={3}
                                            />
                                        </motion.div>
                                    )}

                                    <button
                                        className="btn btn-primary log-submit-btn"
                                        disabled={!selectedMood || submitting}
                                        onClick={handleSubmit}
                                    >
                                        {submitting ? 'Recording...' : 'Log Mood'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MoodTracker;
