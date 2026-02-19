import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * AuthContext
 *
 * Manages authentication state across the app.
 * Provides:
 * - user: Current user object
 * - token: JWT token
 * - login: Login function
 * - signup: Signup function (does NOT auto-login)
 * - sendOtp: Send OTP to email
 * - verifyOtp: Verify OTP entered by user
 * - logout: Logout function
 * - loading: Loading state
 * - isAuthenticated: Boolean indicating if user is logged in
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Send OTP to email (Step 1 of signup)
   */
  const sendOtp = async (email) => {
    try {
      const response = await authAPI.sendOtp({ email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      };
    }
  };

  /**
   * Verify OTP (Step 2 of signup)
   */
  const verifyOtp = async (email, otp) => {
    try {
      const response = await authAPI.verifyOtp({ email, otp });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid OTP. Please try again.',
      };
    }
  };

  /**
   * Signup Function
   *
   * Creates a new user account.
   * Does NOT auto-login — user must login separately after signup.
   */
  const signup = async (name, email, password, otp) => {
    try {
      const response = await authAPI.signup({ name, email, password, otp });
      // No token stored — user must login manually
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  };

  /**
   * Login Function
   *
   * Authenticates user and stores token.
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  /**
   * Logout Function
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    sendOtp,
    verifyOtp,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
