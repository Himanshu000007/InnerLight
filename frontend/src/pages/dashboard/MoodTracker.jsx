import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Heart, Activity, Moon, Plus } from 'lucide-react';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const MoodTracker = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const moods = [
    { value: 'very_sad', emoji: '😢', label: 'Very Sad', color: 'from-red-500 to-pink-500' },
    { value: 'sad', emoji: '😔', label: 'Sad', color: 'from-orange-500 to-red-500' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-yellow-500 to-orange-500' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'from-green-500 to-emerald-500' },
    { value: 'very_happy', emoji: '😄', label: 'Very Happy', color: 'from-blue-500 to-cyan-500' },
  ];

  const [selectedMood, setSelectedMood] = useState('happy');

  const onSubmit = async (data) => {
    try {
      const payload = {
        mood: selectedMood,
        moodScore: parseInt(data.moodScore),
        intensity: data.intensity,
        trigger: data.trigger,
        energy: parseInt(data.energy),
        sleep: data.sleep ? parseInt(data.sleep) : null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      };

      const response = await axiosInstance.post('/moods', payload);
      toast.success('Mood recorded successfully!');
      reset();
      setMoodHistory([response.data.data, ...moodHistory]);
      setSelectedMood('happy');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record mood');
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
        <h1 className="text-4xl font-bold text-text">Mood Tracker</h1>
        <p className="text-text-secondary">Track your emotions and understand your patterns</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <h2 className="text-2xl font-bold text-text mb-6">How are you feeling?</h2>

            {/* Mood Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-3">
                Select Your Mood
              </label>
              <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-lg text-center transition ${
                      selectedMood === mood.value
                        ? `bg-gradient-to-br ${mood.color} text-white ring-2 ring-offset-2 ring-offset-card ring-primary`
                        : 'bg-border text-text-secondary hover:bg-border/80'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <p className="text-xs font-semibold">{mood.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Mood Score */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Mood Intensity (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  {...register('moodScore', { required: true })}
                  className="w-full"
                />
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Intensity Level
                </label>
                <select
                  {...register('intensity')}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What triggered this mood?
                </label>
                <Input
                  type="text"
                  placeholder="e.g., good meeting, family time, work stress..."
                  {...register('trigger')}
                />
              </div>

              {/* Energy & Sleep */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Energy Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...register('energy')}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Sleep Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    {...register('sleep')}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., work, family, exercise..."
                  {...register('tags')}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-primary text-white"
              >
                <Plus size={20} />
                {isSubmitting ? 'Recording...' : 'Record Mood'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Recent Moods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <h3 className="text-lg font-bold text-text mb-4">Recent Moods</h3>
            <div className="space-y-3">
              {moodHistory.slice(0, 5).map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-border rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Heart size={20} className="text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text capitalize">{entry.mood}</p>
                      <p className="text-xs text-text-secondary">
                        Score: {entry.moodScore}/5
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker;