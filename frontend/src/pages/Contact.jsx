import { useState } from 'react';
import { contactAPI } from '../services/api';
import './Contact.css';

/**
 * Contact Page
 * 
 * Contact form for users to reach out.
 * Includes helpline numbers and disclaimer.
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      await contactAPI.submitContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us 📧</h1>
        <p>We're here to help. Reach out if you need support.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {success && (
            <div className="contact-success">
              Thank you for contacting us! We'll get back to you soon.
            </div>
          )}
          {error && <div className="contact-error">{error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="input contact-textarea"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary contact-submit"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info-section">
          <div className="info-card">
            <h3>Emergency Support</h3>
            <p>If you're in crisis, please reach out to:</p>
            <ul className="helpline-list">
              <li>
                <strong>National Suicide Prevention Lifeline:</strong>
                <br />
                <a href="tel:988">988</a>
              </li>
              <li>
                <strong>Crisis Text Line:</strong>
                <br />
                Text HOME to <a href="tel:741741">741741</a>
              </li>
              <li>
                <strong>Emergency Services:</strong>
                <br />
                <a href="tel:911">911</a>
              </li>
            </ul>
          </div>

          <div className="info-card disclaimer">
            <h3>Important Disclaimer</h3>
            <p>
              InnerLight is a mental wellness platform designed to provide support
              and community. However, it does not replace professional medical care,
              therapy, or emergency services. If you're experiencing a mental health
              crisis, please contact a mental health professional or emergency services
              immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
