import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Zap, Wind, Sparkles, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const AIWellness = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const quickPrompts = [
    { icon: Sparkles, text: 'I need motivation today', label: 'Motivation' },
    { icon: Wind, text: 'Help me with anxiety', label: 'Anxiety Relief' },
    { icon: Zap, text: 'How to be more productive?', label: 'Productivity' },
  ];

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: data.message,
    };

    setMessages(prev => [...prev, userMessage]);
    reset();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/wellness', {
        prompt: data.message,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.data.response,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = async (prompt) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: prompt,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/wellness', {
        prompt,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.data.response,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  const getBreathingExercise = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/breathing-exercise', {
        duration: 5,
        focusArea: 'general',
      });

      const message = {
        id: Date.now(),
        type: 'ai',
        text: response.data.data.exercise,
      };

      setMessages(prev => [...prev, message]);
    } catch (error) {
      toast.error('Failed to generate breathing exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">AI Wellness Assistant</h1>
        <p className="text-text-secondary">Chat with your personal wellness companion powered by AI</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Sparkles size={48} className="text-primary mb-4 opacity-50" />
                  <p className="text-text-secondary mb-4">Start a conversation with your AI wellness assistant</p>
                  <p className="text-xs text-text-secondary">Ask anything about mental health, wellness, or meditation</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                          : 'bg-border text-text rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                ))
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-border px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                {...register('message', { required: true })}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="gradient-primary text-white"
                size="md"
              >
                <Send size={20} />
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Quick Prompts */}
          <Card>
            <h3 className="text-lg font-bold text-text mb-4">Quick Prompts</h3>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <motion.button
                    key={prompt.label}
                    whileHover={{ x: 4 }}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left bg-border hover:bg-border/80 rounded-lg transition disabled:opacity-50"
                  >
                    <Icon size={20} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-text">{prompt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </Card>

          {/* Breathing Exercise */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <h3 className="text-lg font-bold text-text mb-3">Breathing Exercise</h3>
            <p className="text-sm text-text-secondary mb-4">
              Take a moment for a guided breathing exercise to calm your mind.
            </p>
            <Button
              onClick={getBreathingExercise}
              disabled={loading}
              className="w-full gradient-primary text-white"
            >
              <Wind size={20} />
              Start Exercise
            </Button>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="text-lg font-bold text-text mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>💭 Be specific with your questions</li>
              <li>🌟 Share how you're feeling</li>
              <li>💪 Ask for wellness tips</li>
              <li>🧘 Request meditation guides</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AIWellness;