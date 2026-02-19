import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import './Journal.css';

/**
 * Journal Page
 * 
 * Private journal for authenticated users.
 * Users can select mood and write entries.
 */
const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const moods = ['Happy', 'Calm', 'Anxious', 'Stressed'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getEntries();
      setEntries(response.data.entries || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Please write something in your journal entry.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await journalAPI.createEntry({ mood, note: note.trim() });
      setNote('');
      setMood('Happy');
      setShowForm(false);
      loadEntries();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMoodEmoji = (moodValue) => {
    const emojiMap = {
      Happy: '😊',
      Calm: '😌',
      Anxious: '😰',
      Stressed: '😓',
    };
    return emojiMap[moodValue] || '😊';
  };

  const getMoodColor = (moodValue) => {
    const colorMap = {
      Happy: '#FFD700',
      Calm: '#87CEEB',
      Anxious: '#FFA07A',
      Stressed: '#FF6B6B',
    };
    return colorMap[moodValue] || '#9B87F5';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h1>My Journal 📔</h1>
        <p>Your private space to express your thoughts and feelings</p>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary journal-new-btn"
        >
          + New Entry
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="journal-form">
          <div className="journal-form-header">
            <h3>New Journal Entry</h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setNote('');
                setError('');
              }}
              className="journal-close"
            >
              ×
            </button>
          </div>

          <div className="form-group">
            <label>How are you feeling?</label>
            <div className="mood-selector">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`mood-option ${mood === m ? 'active' : ''}`}
                  onClick={() => setMood(m)}
                  style={{
                    borderColor: mood === m ? getMoodColor(m) : '#E2E8F0',
                    background: mood === m ? `${getMoodColor(m)}20` : 'white',
                  }}
                >
                  <span className="mood-emoji">{getMoodEmoji(m)}</span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">What's on your mind?</label>
            <textarea
              id="note"
              className="input journal-textarea"
              placeholder="Write freely... this is your safe space."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={8}
              required
            />
          </div>

          {error && <div className="journal-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      )}

      <div className="journal-entries">
        {loading ? (
          <div className="journal-loading">Loading your journal...</div>
        ) : entries.length === 0 ? (
          <div className="journal-empty">
            <p>No entries yet. Start your journaling journey!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry._id}
              className="journal-entry"
              style={{
                borderLeftColor: getMoodColor(entry.mood),
              }}
            >
              <div className="entry-header">
                <div className="entry-mood">
                  <span className="entry-mood-emoji">
                    {getMoodEmoji(entry.mood)}
                  </span>
                  <span className="entry-mood-text">{entry.mood}</span>
                </div>
                <span className="entry-date">{formatDate(entry.createdAt)}</span>
              </div>
              <div className="entry-note">{entry.note}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
