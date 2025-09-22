import axios from 'axios';

const BOOKING_API_BASE_URL = 'http://localhost:8082';

// Create axios instance for booking service
const bookingApi = axios.create({
  baseURL: BOOKING_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
bookingApi.interceptors.request.use(
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
bookingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Booking {
  id: number;
  userEmail: string;
  flightId: number;
  bookingTime: string;
  seatsBooked: number;
  totalPrice: number;
}

export interface CreateBookingRequest {
  flightId: number;
  seats: number;
}

export interface PaymentRequest {
  bookingId: number;
  amount: number;
}

export const bookingService = {
  // Create a new booking
  createBooking: async (flightId: number, seats: number): Promise<Booking> => {
    try {
      const response = await bookingApi.post('/bookings', null, {
        params: {
          flightId,
          seats
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get current user's bookings
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const response = await bookingApi.get('/bookings/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get all bookings (admin only)
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const response = await bookingApi.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  // Process payment for booking
  processPayment: async (bookingId: number, amount: number): Promise<string> => {
    try {
      const response = await bookingApi.post(`/bookings/doBooking/${bookingId}/${amount}`);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
};