import Contact from '../models/Contact.js';

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public (anyone can contact)
 * 
 * Creates a contact form submission.
 * Used for users to reach out, report issues, or ask questions.
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and message' 
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ 
        message: 'Message must be at least 10 characters' 
      });
    }

    // Create contact submission
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    res.status(201).json({
      message: 'Thank you for contacting us. We will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      message: 'Server error submitting contact form', 
      error: error.message 
    });
  }
};
