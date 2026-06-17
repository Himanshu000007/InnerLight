import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Flag, Plus, Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const CommunityFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likes, setLikes] = useState({});

  const categories = ['all', 'advice', 'experience', 'question', 'support', 'celebration'];

  const handleConnectChat = async (postId) => {
    try {
      await axiosInstance.post('/chats', { postId });
      toast.success('Chat connection initiated!');
      navigate('/chats');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to connect');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/posts', {
        params: selectedCategory !== 'all' ? { category: selectedCategory } : {},
      });
      setPosts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/posts', {
        content: data.content,
        category: data.category,
        isAnonymous: !!data.isAnonymous,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      });
      toast.success('Post created successfully!');
      reset();
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const isLiked = likes[postId];
      if (isLiked) {
        await axiosInstance.post(`/posts/${postId}/unlike`);
        setLikes(prev => ({ ...prev, [postId]: false }));
      } else {
        await axiosInstance.post(`/posts/${postId}/like`);
        setLikes(prev => ({ ...prev, [postId]: true }));
      }
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await axiosInstance.post(`/posts/${postId}/bookmark`);
      toast.success('Post bookmarked!');
    } catch (error) {
      toast.error('Failed to bookmark post');
    }
  };

  const handleReport = async (postId) => {
    const reason = prompt('Why are you reporting this post? (inappropriate, spam, harassment, hate_speech, self_harm, other)');
    if (reason) {
      try {
        await axiosInstance.post('/reports', {
          postId,
          reason: reason.toLowerCase(),
          description: 'User reported via community feed',
        });
        toast.success('Post reported. Thank you for helping keep our community safe.');
      } catch (error) {
        toast.error('Failed to report post');
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">Community Feed</h1>
        <p className="text-text-secondary">Share your experiences and support others</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* New Post Card */}
          <Card className="border-primary border-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <input
                type="text"
                placeholder="Share your thoughts..."
                onClick={() => setShowNewPost(true)}
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition cursor-pointer"
              />
            </div>

            {showNewPost && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t border-border pt-4">
                <textarea
                  placeholder="What's on your mind? (minimum 10 characters)"
                  rows="5"
                  {...register('content', {
                    required: 'Content is required',
                    minLength: { value: 10, message: 'Must be at least 10 characters' },
                  })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition resize-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Category
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('isAnonymous')}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span className="text-sm font-medium text-text">Anonymous</span>
                    </label>
                  </div>
                </div>

                <Input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  {...register('tags')}
                />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 gradient-primary text-white"
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowNewPost(false);
                      reset();
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Posts List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-text-secondary mb-4">No posts yet. Be the first to share!</p>
            </Card>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {post.isAnonymous ? '👤' : (post.userId?.firstName?.charAt(0) || 'U')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text">
                          {post.isAnonymous ? 'Anonymous' : `${post.userId?.firstName} ${post.userId?.lastName}`}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-text mb-4">{post.content}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-border text-text-secondary text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-2 text-text-secondary hover:text-red-500 transition"
                      >
                        <Heart
                          size={20}
                          fill={likes[post._id] ? 'currentColor' : 'none'}
                          className={likes[post._id] ? 'text-red-500' : ''}
                        />
                        <span className="text-sm">{post.likeCount || 0}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition"
                      >
                        <MessageCircle size={20} />
                        <span className="text-sm">{post.replyCount || 0}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-text-secondary hover:text-accent transition"
                      >
                        <Share2 size={20} />
                      </motion.button>
                    </div>

                    <div className="flex gap-2 items-center">
                      {(() => {
                        // Safely extract the post author's ID as a string
                        const postAuthorId = post.userId?._id?.toString() || post.userId?.toString() || null;
                        const currentUserId = (user?.id || user?._id)?.toString() || null;
                        // Show Connect only when: author is known AND it's not the current user's post
                        const canConnect = postAuthorId && currentUserId && postAuthorId !== currentUserId;
                        return canConnect ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConnectChat(post._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary bg-opacity-10 text-primary hover:bg-primary hover:text-white rounded-lg transition text-xs font-semibold mr-1"
                          >
                            <MessageSquare size={16} />
                            Connect
                          </motion.button>
                        ) : null;
                      })()}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBookmark(post._id)}
                        className="p-2 text-text-secondary hover:text-primary rounded-lg hover:bg-border transition"
                      >
                        <Bookmark size={20} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReport(post._id)}
                        className="p-2 text-text-secondary hover:text-danger rounded-lg hover:bg-border transition"
                      >
                        <Flag size={20} />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Search */}
          <Card>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition"
              />
            </div>
          </Card>

          {/* Categories */}
          <Card>
            <h3 className="text-lg font-bold text-text mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold'
                      : 'text-text-secondary hover:bg-border hover:text-text'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <h3 className="text-lg font-bold text-text mb-3">Community Tips</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Be respectful and supportive</li>
              <li>✓ Share authentic experiences</li>
              <li>✓ Respect others' privacy</li>
              <li>✓ Use appropriate language</li>
              <li>✓ Report harmful content</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityFeed;