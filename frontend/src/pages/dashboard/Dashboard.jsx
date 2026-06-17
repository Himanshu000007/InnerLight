import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Heart, BookOpen, Users, Brain, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const AFFIRMATIONS = [
  'You are worthy of love and belonging, exactly as you are.',
  'Every day is a new beginning. Take a deep breath and start again.',
  'You have survived 100% of your hardest days. You are stronger than you think.',
  'It is okay to not be okay. Healing is not linear.',
  'Your feelings are valid. Your emotions are messengers, not masters.',
  'You are doing the best you can, and that is enough.',
  'Rest is productive. Taking care of yourself matters.',
  'One small step forward is still progress. Keep going.',
  'You are not alone. Millions of people understand how you feel.',
  'Your mental health journey is unique — comparison is the thief of joy.',
  'Be gentle with yourself. You are a work in progress.',
  'Today, choose one thing that brings you peace. That is enough.',
];

const Dashboard = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [affirmationIndex, setAffirmationIndex] = useState(
    Math.floor(Date.now() / 86400000) % AFFIRMATIONS.length
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodRes, statsRes] = await Promise.all([
          axiosInstance.get('/moods/analytics?days=30'),
          axiosInstance.get('/moods/trend?days=7'),
        ]);
        setMoodData(moodRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'];

  const quickActions = [
    { icon: Heart, label: 'Track Mood', path: '/mood-tracker', color: 'from-red-500 to-pink-500' },
    { icon: BookOpen, label: 'Journal', path: '/journal', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Community', path: '/community', color: 'from-purple-500 to-pink-500' },
    { icon: Brain, label: 'AI Wellness', path: '/ai-wellness', color: 'from-green-500 to-emerald-500' },
    { icon: MessageSquare, label: 'Chats', path: '/chats', color: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">
          Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.firstName}</span>! 👋
        </h1>
        <p className="text-text-secondary">Here's your wellness overview for today</p>
      </motion.div>

      {/* Daily Affirmation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Daily Affirmation</p>
              <p className="text-text font-medium text-base leading-snug italic">"{AFFIRMATIONS[affirmationIndex]}"</p>
            </div>
            <button
              onClick={() => setAffirmationIndex((i) => (i + 1) % AFFIRMATIONS.length)}
              className="text-xs text-text-secondary hover:text-primary transition px-3 py-1.5 rounded-lg hover:bg-border flex-shrink-0 whitespace-nowrap"
            >
              Next ✨
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              as={motion.div}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${action.color} p-6 rounded-xl text-white cursor-pointer transition-all duration-300 hover:shadow-lg`}
            >
              <Icon size={32} className="mb-2" />
              <p className="font-semibold">{action.label}</p>
            </Link>
          );
        })}
      </motion.div>

      {/* Stats Grid */}
      {!loading && moodData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="text-text-secondary text-sm">Total Moods</h3>
            <p className="text-3xl font-bold text-text">{moodData.totalEntries}</p>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-text-secondary text-sm">Average Mood</h3>
            <p className="text-3xl font-bold text-text">{moodData.averageScore}</p>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
              <BookOpen size={24} />
            </div>
            <h3 className="text-text-secondary text-sm">This Month</h3>
            <p className="text-3xl font-bold text-text">{user?.statistics?.totalJournalEntries || 0}</p>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 rounded-lg flex items-center justify-center text-white mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-text-secondary text-sm">Community</h3>
            <p className="text-3xl font-bold text-text">{user?.statistics?.totalPosts || 0}</p>
          </Card>
        </motion.div>
      )}

      {/* Charts */}
      {!loading && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Mood Trend */}
          <Card>
            <h3 className="text-lg font-bold text-text mb-4">Mood Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#CBD5E1" />
                <YAxis stroke="#CBD5E1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="averageScore" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Mood Distribution */}
          {moodData && Object.keys(moodData.moodCounts).length > 0 && (
            <Card>
              <h3 className="text-lg font-bold text-text mb-4">Mood Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(moodData.moodCounts).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-2">Ready to improve your wellness?</h3>
        <p className="text-white text-opacity-90 mb-4">
          Start by tracking your mood and recording your feelings in your journal.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
            Learn More
          </Button>
          <Link to="/mood-tracker">
            <Button className="bg-white text-primary hover:bg-opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;