import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/contacts', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        category: data.category,
      });

      toast.success('Message sent! We\'ll get back to you soon.');
      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-text mb-4">Get in Touch</h1>
          <p className="text-xl text-text-secondary">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-emerald-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">Message Sent!</h2>
                <p className="text-text-secondary mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>

                <Input
                  type="text"
                  placeholder="Subject"
                  {...register('subject', { required: 'Subject is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                  >
                    <option value="feedback">Feedback</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <textarea
                  placeholder="Your Message"
                  rows="6"
                  {...register('message', { required: 'Message is required' })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition resize-none"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-white"
                  size="lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;