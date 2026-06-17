import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      reset();
    } catch (error) {
      // Error shown in AuthContext
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Avatar uploaded successfully!');
      // Update avatar in UI
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
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
        <h1 className="text-4xl font-bold text-text">My Profile</h1>
        <p className="text-text-secondary">Manage your account and personal information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-border">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.firstName?.charAt(0)
                  )}
                </div>
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white cursor-pointer hover:bg-secondary transition"
                >
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </motion.label>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-text">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-text-secondary mb-4">{user?.email}</p>
                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-full font-semibold">
                    {user?.role?.toUpperCase()}
                  </span>
                  {user?.isEmailVerified && (
                    <span className="px-3 py-1 bg-success bg-opacity-20 text-success text-xs rounded-full font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      First Name
                    </label>
                    <Input
                      type="text"
                      {...register('firstName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      {...register('lastName')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    maxLength="500"
                    rows="4"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 gradient-primary text-white"
                  >
                    <Save size={20} />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    <X size={20} />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">About</p>
                  <p className="text-text">{user?.bio || 'No bio added yet'}</p>
                </div>

                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full gradient-primary text-white"
                >
                  <Edit2 size={20} />
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {user?.statistics?.totalMoods || 0}
            </div>
            <p className="text-text-secondary text-sm">Moods Tracked</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {user?.statistics?.totalJournalEntries || 0}
            </div>
            <p className="text-text-secondary text-sm">Journal Entries</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {user?.statistics?.totalPosts || 0}
            </div>
            <p className="text-text-secondary text-sm">Community Posts</p>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <p className="text-xs text-text-secondary mb-2">Member Since</p>
            <p className="font-semibold text-text">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;