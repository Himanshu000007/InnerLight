import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await axiosInstance.get('/users/profile');
          setUser(response.data.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      toast.success('Signup successful! Please verify your email.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw error;
    }
  };

  const sendOTP = async (email, firstName) => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        email,
        firstName,
      });
      toast.success('OTP sent to your email');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/verify-email', {
        email,
        otp,
      });
      toast.success('Email verified successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });
      toast.success('Password reset email sent');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      toast.success('Password reset successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await axiosInstance.put('/users/profile', data);
      setUser(response.data.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      throw error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/users/change-password', {
        oldPassword,
        newPassword,
      });
      toast.success('Password changed successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    sendOTP,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};