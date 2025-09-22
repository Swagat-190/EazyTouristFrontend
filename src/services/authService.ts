import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string; // Optional role field
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  email: string;
  role: string;
}

export const authService = {
  // Register new user
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginData): Promise<LoginResponse> => {
    try {
      const response = await api.post('/users/login', credentials);
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};