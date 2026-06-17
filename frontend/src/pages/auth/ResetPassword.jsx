import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch('newPassword');

  const urlEmail = searchParams.get('email') || '';
  const urlOtp = searchParams.get('otp') || '';

  const showEmailInput = !urlEmail;
  const showOtpInput = !urlOtp;

  const onSubmit = async (data) => {
    try {
      const emailToUse = urlEmail || data.email;
      const otpToUse = urlOtp || data.otp;

      if (!emailToUse) {
        toast.error('Email is required');
        return;
      }
      if (!otpToUse) {
        toast.error('Verification code (OTP) is required');
        return;
      }

      await resetPassword(emailToUse, otpToUse, data.newPassword);
      navigate('/login');
    } catch (error) {
      // Error toast shown in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Login
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-text mb-2"
          >
            Create New Password
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary"
          >
            Enter a strong password for your account
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {showEmailInput && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email?.message}
                />
              </div>
            )}

            {showOtpInput && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Verification Code (6-digit OTP)
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  {...register('otp', {
                    required: 'Verification code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Verification code must be 6 digits',
                    },
                  })}
                  error={errors.otp?.message}
                />
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...register('newPassword', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  error={errors.newPassword?.message}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;