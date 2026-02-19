import Post from '../models/Post.js';
import Reply from '../models/Reply.js';

/**
 * @route   POST /api/posts
 * @desc    Create a new anonymous post
 * @access  Private (requires auth middleware)
 * 
 * Creates a post anonymously.
 * userId is stored but never returned in response.
 */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    // Validation
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ 
        message: 'Post content must be at least 10 characters' 
      });
    }

    // Create post
    // req.user is set by auth middleware
    const post = await Post.create({
      content: content.trim(),
      userId: req.user._id
    });

    // Return post without userId (anonymous)
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      message: 'Server error creating post', 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/posts
 * @desc    Get all posts (feed)
 * @access  Public (anyone can view feed)
 * 
 * Returns all posts sorted by newest first.
 * userId is never included in response (anonymous).
 */
export const getPosts = async (req, res) => {
  try {
    // Get all posts, sorted by newest first
    // Select only fields we want to expose (exclude userId)
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .select('-userId') // Exclude userId from response
      .limit(50); // Limit to 50 most recent posts

    res.status(200).json({
      message: 'Posts retrieved successfully',
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      message: 'Server error fetching posts', 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post with replies
 * @access  Public
 * 
 * Returns a post with all its replies.
 * All user IDs are hidden (anonymous).
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find post
    const post = await Post.findById(id).select('-userId');
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Find all replies for this post
    const replies = await Reply.find({ postId: id })
      .sort({ createdAt: 1 }) // Oldest replies first
      .select('-userId') // Exclude userId
      .select('-postId'); // Exclude postId (redundant)

    res.status(200).json({
      message: 'Post retrieved successfully',
      post: {
        ...post.toObject(),
        replies
      }
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid post ID' 
      });
    }

    res.status(500).json({ 
      message: 'Server error fetching post', 
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/posts/:id/reply
 * @desc    Reply to a post
 * @access  Private (requires auth middleware)
 * 
 * Creates an anonymous reply to a post.
 * userId is stored but never returned.
 */
export const replyToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validation
    if (!content || content.trim().length < 5) {
      return res.status(400).json({ 
        message: 'Reply content must be at least 5 characters' 
      });
    }

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Create reply
    const reply = await Reply.create({
      content: content.trim(),
      postId: id,
      userId: req.user._id
    });

    // Return reply without userId (anonymous)
    res.status(201).json({
      message: 'Reply created successfully',
      reply: {
        id: reply._id,
        content: reply.content,
        createdAt: reply.createdAt
      }
    });
  } catch (error) {
    console.error('Reply to post error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid post ID' 
      });
    }

    res.status(500).json({ 
      message: 'Server error creating reply', 
      error: error.message 
    });
  }
};
