import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, sendOTP } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [timer, setTimer] = useState(0);

  const email = location.state?.email || '';
  const firstName = location.state?.firstName || '';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data) => {
    try {
      await verifyEmail(email, data.otp);
      navigate('/login');
    } catch (error) {
      // Error toast shown in AuthContext
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(email, firstName);
      setTimer(60);
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
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <Mail size={32} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-text mb-2"
          >
            Verify Your Email
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary"
          >
            We sent a code to <span className="font-semibold text-text">{email}</span>
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
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Enter 6-digit Code
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                {...register('otp', {
                  required: 'OTP is required',
                  minLength: {
                    value: 6,
                    message: 'OTP must be 6 digits',
                  },
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'OTP must be numeric',
                  },
                })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-center text-2xl tracking-widest font-mono focus:border-primary focus:outline-none transition"
              />
              {errors.otp && (
                <p className="text-danger text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm mb-3">
              Didn't receive the code?
            </p>
            <Button
              onClick={handleResendOTP}
              disabled={timer > 0}
              className="text-primary hover:text-secondary transition disabled:text-text-secondary disabled:cursor-not-allowed font-semibold"
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;