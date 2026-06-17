import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { changePassword, logout } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting }, reset, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const password = watch('newPassword');

  const onSubmitPassword = async (data) => {
    try {
      await changePassword(data.oldPassword, data.newPassword);
      reset();
    } catch (error) {
      // Error shown in AuthContext
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;

    const confirmText = prompt('Type "DELETE" to confirm permanent account deletion:');
    if (confirmText !== 'DELETE') {
      toast.error('Confirmation failed');
      return;
    }

    setDeleteLoading(true);
    try {
      await axiosInstance.delete('/users/account');
      toast.success('Account deleted successfully');
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setDeleteLoading(false);
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
        <h1 className="text-4xl font-bold text-text">Settings</h1>
        <p className="text-text-secondary">Manage your preferences and security</p>
      </motion.div>

      <div className="max-w-2xl">
        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-text">Change Password</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  {...register('oldPassword', { required: 'Current password is required' })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Must be at least 6 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Must contain uppercase, lowercase, and number',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-primary text-white"
              >
                <Save size={20} />
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-text">Notifications</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-border rounded-lg transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded accent-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-text">Email Notifications</p>
                  <p className="text-xs text-text-secondary">Receive important updates via email</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-border rounded-lg transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded accent-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-text">Community Updates</p>
                  <p className="text-xs text-text-secondary">Get notified about new posts and replies</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-border rounded-lg transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded accent-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-text">Wellness Reminders</p>
                  <p className="text-xs text-text-secondary">Daily mood tracking and wellness reminders</p>
                </div>
              </label>

              <Button className="w-full gradient-primary text-white mt-4">
                Save Preferences
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border-danger/30 bg-danger/5">
            <div className="flex items-center gap-3 mb-6">
              <Trash2 size={24} className="text-danger" />
              <h2 className="text-2xl font-bold text-danger">Danger Zone</h2>
            </div>

            <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-danger font-semibold mb-2">Delete Account</p>
              <p className="text-xs text-text-secondary mb-4">
                This action is permanent. All your data including moods, journals, and posts will be deleted and cannot be recovered.
              </p>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full bg-danger text-white hover:bg-danger/90"
              >
                <Trash2 size={20} />
                {deleteLoading ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;