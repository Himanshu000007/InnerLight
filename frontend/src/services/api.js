import axios from 'axios';

/**
 * API Service
 * 
 * Centralized Axios instance for API calls.
 * Automatically attaches JWT token from localStorage to requests.
 * Handles token expiration and errors.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * Automatically adds JWT token to all requests if available.
 * Token is stored in localStorage after login/signup.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles common errors:
 * - 401: Token expired/invalid → clear token and redirect to login
 * - 403: Access denied
 * - 500: Server error
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login will be handled by ProtectedRoute component
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const moodAPI = {
  logMood: (moodData) => api.post('/mood/log', moodData),
  getMoodHistory: () => api.get('/mood/history'),
  getMoodStats: () => api.get('/mood/stats'),
};

// Posts API
export const postsAPI = {
  getPosts: () => api.get('/posts'),
  createPost: (data) => api.post('/posts', data),
  getPostById: (id) => api.get(`/posts/${id}`),
  replyToPost: (id, data) => api.post(`/posts/${id}/reply`, data),
};

// Journal API
export const journalAPI = {
  getEntries: () => api.get('/journal'),
  createEntry: (data) => api.post('/journal', data),
  getEntryById: (id) => api.get(`/journal/${id}`),
};

// Contact API
export const contactAPI = {
  submitContact: (data) => api.post('/contact', data),
};

export default api;
