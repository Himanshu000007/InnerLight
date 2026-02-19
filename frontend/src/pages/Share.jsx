import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Send, PlusCircle, Sparkles } from 'lucide-react';
import './Share.css';

const Share = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = [
    '😊', '😌', '🌱', '🌿', '✨', '💛', '🫂', '🕊️', '🧘', '🌊',
    '💪', '🌈', '🌙', '⭐', '🧡', '🙏', '🌸', '🍃', '🌻', '🦋',
    '💭', '🕯️', '☕', '🏡', '🎨', '🧩', '🧸', '☁️', '☔', '☀️',
    '🫂', '🤝', '🙌', '💖', '🥰', '🤠', '🥳', '😎', '🧐', '🤓',
    '🥺', '😢', '😭', '😤', '😡', '🤯', '😴', '🥱', '🤢', '🤮'
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (emoji) => {
    setNewPost(prev => prev + emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || newPost.trim().length < 5) {
      setError('Post must be at least 5 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await postsAPI.createPost({ content: newPost.trim() });
      setNewPost('');
      setShowForm(false);
      setShowEmojiPicker(false);
      loadPosts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="share-container">
      <motion.div
        className="share-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Anonymous Share <Sparkles size={24} className="header-sparkle" /></h1>
        <p>A premium, safe space to share your heart without reveal.</p>
      </motion.div>

      {isAuthenticated && (
        <div className="share-create-section">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="btn-trigger"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setShowForm(true)}
                className="btn btn-primary share-trigger-btn"
              >
                <PlusCircle size={18} /> What's on your mind?
              </motion.button>
            ) : (
              <motion.div
                key="share-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="share-card-form glass"
              >
                <form onSubmit={handleSubmit}>
                  <div className="textarea-wrapper">
                    <textarea
                      className="share-textarea"
                      placeholder="Share your thoughts gently..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                      required
                    />
                    <div className="form-tools">
                      <button
                        type="button"
                        className={`emoji-btn ${showEmojiPicker ? 'active' : ''}`}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile size={20} />
                      </button>
                    </div>
                  </div>

                  {showEmojiPicker && (
                    <motion.div
                      className="emoji-picker-grid"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {emojis.map((emoji, i) => (
                        <button
                          key={i}
                          type="button"
                          className="emoji-item"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {error && <div className="share-error-box">{error}</div>}

                  <div className="share-form-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setNewPost('');
                        setError('');
                        setShowEmojiPicker(false);
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary post-btn"
                      disabled={submitting}
                    >
                      {submitting ? 'Sharing...' : <><Send size={16} /> Share Anonymously</>}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="share-feed">
        {loading ? (
          <div className="share-loading-state">
            <div className="spinner"></div>
            <p>Gathering thoughts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="share-empty-state">
            <div className="empty-icon">🕊️</div>
            <h3>No posts yet</h3>
            <p>Your voice could be the first to sparkle here.</p>
          </div>
        ) : (
          <motion.div
            className="posts-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onReply={loadPosts} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Share;
