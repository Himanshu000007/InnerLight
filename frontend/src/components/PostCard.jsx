import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  User,
  Clock
} from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, onReply }) => {
  const { isAuthenticated } = useAuth();
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState('');

  const loadReplies = async () => {
    try {
      setLoadingReplies(true);
      const response = await postsAPI.getPostById(post._id);
      setReplies(response.data.post.replies || []);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (showReplies) {
      loadReplies();
    }
  }, [showReplies]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 5) {
      setError('Reply must be at least 5 characters long.');
      return;
    }

    try {
      setSubmittingReply(true);
      setError('');
      await postsAPI.replyToPost(post._id, { content: replyText.trim() });
      setReplyText('');
      loadReplies();
      if (onReply) onReply();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="post-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="post-header">
        <div className="author-info">
          <div className="author-avatar">
            <User size={16} />
          </div>
          <span className="author-name">Anonymous Soul</span>
        </div>
        <div className="post-time-badge">
          <Clock size={14} /> <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-footer">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className={`post-reply-toggle-btn ${showReplies ? 'active' : ''}`}
        >
          <MessageCircle size={18} />
          <span>{replies.length} {replies.length === 1 ? 'Reflection' : 'Reflections'}</span>
          {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            className="post-replies-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="replies-divider"></div>

            <div className="replies-container">
              {loadingReplies ? (
                <div className="replies-status">Searching for echoes...</div>
              ) : replies.length === 0 ? (
                <div className="replies-status">No echoes yet. Be the first to resonate.</div>
              ) : (
                <div className="replies-list">
                  {replies.map((reply) => (
                    <motion.div
                      key={reply._id}
                      className="reply-card-mini"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <div className="reply-author">
                        <span className="reply-name">Kind Stranger</span>
                        <span className="reply-dot">•</span>
                        <span className="reply-time">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="reply-text">{reply.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <form onSubmit={handleReplySubmit} className="reply-form-premium">
                <div className="reply-input-wrapper">
                  <textarea
                    className="reply-textarea-mini"
                    placeholder="Offer a supportive word..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    required
                  />
                  <button
                    type="submit"
                    className="reply-send-btn"
                    disabled={submittingReply}
                  >
                    {submittingReply ? '...' : <Send size={16} />}
                  </button>
                </div>
                {error && <div className="reply-error-mini">{error}</div>}
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
