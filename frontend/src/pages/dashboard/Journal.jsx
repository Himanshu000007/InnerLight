import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Heart, Search, Filter, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Journal = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [journals, setJournals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // all, favorites

  const moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/journals');
      setJournals(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch journals');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/journals/${editingId}`, {
          title: data.title,
          content: data.content,
          mood: data.mood,
        });
        toast.success('Journal updated!');
        setEditingId(null);
      } else {
        await axiosInstance.post('/journals', {
          title: data.title,
          content: data.content,
          mood: data.mood,
          isPrivate: true,
        });
        toast.success('Journal entry created!');
      }
      reset();
      setShowForm(false);
      fetchJournals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save journal');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await axiosInstance.delete(`/journals/${id}`);
        toast.success('Entry deleted');
        fetchJournals();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await axiosInstance.put(`/journals/${id}/favorite`);
      fetchJournals();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const displayJournals = viewMode === 'favorites' 
    ? journals.filter(j => j.isFavorite)
    : journals;

  const filteredJournals = displayJournals.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-text">My Journal</h1>
          <p className="text-text-secondary">Express yourself and track your thoughts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            reset();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Plus size={20} />
          New Entry
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary border-2">
              <h2 className="text-2xl font-bold text-text mb-6">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Give your entry a title..."
                    {...register('title', { required: 'Title is required' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    How are you feeling?
                  </label>
                  <select
                    {...register('mood')}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:border-primary focus:outline-none transition"
                  >
                    {moods.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    placeholder="Write your thoughts here... (minimum 10 characters)"
                    rows="8"
                    {...register('content', {
                      required: 'Content is required',
                      minLength: { value: 10, message: 'Must be at least 10 characters' },
                    })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 gradient-primary text-white"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Entry'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      reset();
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('all')}
            variant={viewMode === 'all' ? 'primary' : 'secondary'}
          >
            <Filter size={16} />
            All
          </Button>
          <Button
            onClick={() => setViewMode('favorites')}
            variant={viewMode === 'favorites' ? 'primary' : 'secondary'}
          >
            <Heart size={16} />
            Favorites
          </Button>
        </div>
      </motion.div>

      {/* Journal List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : filteredJournals.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-text-secondary mb-4 opacity-50" />
            <p className="text-text-secondary mb-4">No journal entries yet</p>
            <Button onClick={() => setShowForm(true)} className="gradient-primary text-white">
              <Plus size={16} />
              Write your first entry
            </Button>
          </Card>
        ) : (
          filteredJournals.map((journal, index) => (
            <motion.div
              key={journal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary transition cursor-pointer" hover={true}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-text truncate">
                        {journal.title}
                      </h3>
                      <span className="px-2 py-1 bg-border text-xs rounded-full text-text-secondary whitespace-nowrap">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-secondary line-clamp-2 mb-3">
                      {journal.content}
                    </p>
                    {journal.mood && (
                      <span className="inline-block px-3 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-full">
                        {journal.mood.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleFavorite(journal._id)}
                      className={`p-2 rounded-lg transition ${
                        journal.isFavorite
                          ? 'bg-red-500 bg-opacity-20 text-red-500'
                          : 'bg-border text-text-secondary hover:text-text'
                      }`}
                    >
                      <Heart size={20} fill={journal.isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(journal._id)}
                      className="p-2 bg-border text-text-secondary hover:text-danger rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;