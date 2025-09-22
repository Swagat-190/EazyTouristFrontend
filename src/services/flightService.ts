import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// Create axios instance for flight service
const flightApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
flightApi.interceptors.request.use(
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

// Response interceptor to handle errors
flightApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Flight {
  id?: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  available: boolean;
  availableSeats: number;
}

export interface FlightSearchParams {
  source?: string;
  destination?: string;
}

export const flightService = {
  // Get all flights
  getAllFlights: async (): Promise<Flight[]> => {
    try {
      const response = await flightApi.get('/flights');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get flight by ID
  getFlightById: async (id: number): Promise<Flight> => {
    try {
      const response = await flightApi.get(`/flights/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search flights by origin and destination
  searchFlights: async (params: FlightSearchParams): Promise<Flight[]> => {
    try {
      const response = await flightApi.get('/flights/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new flight (AIRLINE only)
  addFlight: async (flight: Omit<Flight, 'id'>): Promise<Flight> => {
    try {
      const response = await flightApi.post('/flights', flight);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update flight (AIRLINE only)
  updateFlight: async (id: number, flight: Partial<Flight>): Promise<Flight> => {
    try {
      const response = await flightApi.put(`/flights/${id}`, flight);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update available seats (AIRLINE only)
  updateSeats: async (id: number, seats: number): Promise<Flight> => {
    try {
      const response = await flightApi.patch(`/flights/${id}/seats`, null, {
        params: { seats }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete flight (AIRLINE only)
  deleteFlight: async (id: number): Promise<string> => {
    try {
      const response = await flightApi.delete(`/flights/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};