import React, { useState, useEffect } from 'react';
import { flightService, type Flight, type FlightSearchParams } from '../services/flightService';
import { bookingService } from '../services/bookingService';
import './FlightSearch.css';

interface FlightSearchProps {
  onFlightSelect?: (flight: Flight) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onFlightSelect }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    source: '',
    destination: ''
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Popular destinations for autocomplete
  const popularDestinations = [
    'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore',
    'Los Angeles', 'Bangkok', 'Istanbul', 'Mumbai', 'Delhi', 'Bangalore',
    'Sydney', 'Amsterdam', 'Frankfurt', 'Hong Kong', 'Toronto', 'Barcelona'
  ];

  useEffect(() => {
    // Load all flights on component mount
    loadAllFlights();
  }, []);

  const loadAllFlights = async () => {
    setLoading(true);
    try {
      const allFlights = await flightService.getAllFlights();
      setFlights(allFlights);
    } catch (err: any) {
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    
    // Show suggestions when typing in location fields
    if (name === 'source') {
      setShowSourceSuggestions(value.length > 0);
    } else if (name === 'destination') {
      setShowDestinationSuggestions(value.length > 0);
    }
  };

  const handleSuggestionClick = (field: 'source' | 'destination', value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
    setShowSourceSuggestions(false);
    setShowDestinationSuggestions(false);
  };

  const getFilteredSuggestions = (input: string) => {
    return popularDestinations.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchParams.source || !searchParams.destination) {
      setError('Please select both origin and destination');
      return;
    }

    if (searchParams.source === searchParams.destination) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const searchResults = await flightService.searchFlights(searchParams);
      setFlights(searchResults);
      
      if (searchResults.length === 0) {
        setError('No flights found for the selected route');
      }
    } catch (err: any) {
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllFlights = () => {
    setSearchParams({ source: '', destination: '' });
    loadAllFlights();
  };

  const handleBookFlight = async (flight: Flight) => {
    setSelectedFlight(flight);
    setBookingSeats(1);
    setBookingSuccess('');
    setError('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedFlight) return;
    
    setBookingLoading(true);
    try {
      const booking = await bookingService.createBooking(selectedFlight.id, bookingSeats);
      setBookingSuccess(`Booking confirmed! Booking ID: ${booking.id}. Total: $${booking.totalPrice}`);
      setSelectedFlight(null);
      // Refresh flights to update available seats
      await loadAllFlights();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setSelectedFlight(null);
    setBookingSeats(1);
    setError('');
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flight-search-container">
      <div className="search-header">
        <h2 className="search-title">
          <span className="flight-icon">✈️</span>
          Find Your Perfect Flight
        </h2>
        <p className="search-subtitle">Discover amazing destinations at unbeatable prices</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <div className="input-group">
            <label htmlFor="source">From</label>
            <div className="autocomplete-container">
              <input
                type="text"
                id="source"
                name="source"
                value={searchParams.source}
                onChange={handleInputChange}
                onFocus={() => setShowSourceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 150)}
                placeholder="Enter departure city"
                className="location-input"
              />
              {showSourceSuggestions && searchParams.source && (
                <div className="suggestions-dropdown">
                  {getFilteredSuggestions(searchParams.source).map(city => (
                    <div
                      key={city}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick('source', city)}
                    >
                      📍 {city}
                    </div>
                  ))}
                  {getFilteredSuggestions(searchParams.source).length === 0 && (
                    <div className="suggestion-item no-results">
                      No matching cities found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="swap-button-container">
            <button
              type="button"
              className="swap-button"
              onClick={() => setSearchParams(prev => ({
                source: prev.destination,
                destination: prev.source
              }))}
              title="Swap origin and destination"
            >
              ⇄
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="destination">To</label>
            <div className="autocomplete-container">
              <input
                type="text"
                id="destination"
                name="destination"
                value={searchParams.destination}
                onChange={handleInputChange}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 150)}
                placeholder="Enter destination city"
                className="location-input"
              />
              {showDestinationSuggestions && searchParams.destination && (
                <div className="suggestions-dropdown">
                  {getFilteredSuggestions(searchParams.destination).map(city => (
                    <div
                      key={city}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick('destination', city)}
                    >
                      📍 {city}
                    </div>
                  ))}
                  {getFilteredSuggestions(searchParams.destination).length === 0 && (
                    <div className="suggestion-item no-results">
                      No matching cities found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="search-actions">
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
          <button 
            type="button" 
            className="show-all-button" 
            onClick={handleShowAllFlights}
            disabled={loading}
          >
            Show All Flights
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}

      {/* Booking Modal */}
      {selectedFlight && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-header">
              <h3>Book Flight {selectedFlight.flightNumber}</h3>
              <button className="close-modal" onClick={handleCancelBooking}>×</button>
            </div>
            
            <div className="booking-flight-details">
              <div className="booking-route">
                <span>{selectedFlight.origin} → {selectedFlight.destination}</span>
              </div>
              <div className="booking-times">
                <span>Departure: {formatDateTime(selectedFlight.departureTime)}</span>
                <span>Arrival: {formatDateTime(selectedFlight.arrivalTime)}</span>
              </div>
              <div className="booking-price">
                <span>Price per seat: ${selectedFlight.price}</span>
              </div>
            </div>

            <div className="booking-form">
              <div className="seats-selection">
                <label htmlFor="seats">Number of Seats:</label>
                <select 
                  id="seats"
                  value={bookingSeats} 
                  onChange={(e) => setBookingSeats(parseInt(e.target.value))}
                  className="seats-dropdown"
                >
                  {Array.from({ length: Math.min(selectedFlight.availableSeats, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'seat' : 'seats'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-summary">
                <div className="total-price">
                  Total: ${(selectedFlight.price * bookingSeats).toFixed(2)}
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  className="cancel-booking"
                  onClick={handleCancelBooking}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-booking"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flights-section">
        {loading ? (
          <div className="loading-flights">
            <div className="flight-loading-spinner"></div>
            <p>Searching for the best flights...</p>
          </div>
        ) : (
          <>
            <div className="flights-header">
              <h3>
                {searchParams.source && searchParams.destination 
                  ? `Flights from ${searchParams.source} to ${searchParams.destination}`
                  : 'Available Flights'
                }
              </h3>
              <span className="flights-count">{flights.length} flights found</span>
            </div>

            <div className="flights-grid">
              {flights.map(flight => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-header">
                    <div className="flight-number">{flight.flightNumber}</div>
                    <div className="flight-status">
                      <span className={`status-badge ${flight.available ? 'available' : 'unavailable'}`}>
                        {flight.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="flight-route">
                    <div className="route-item">
                      <div className="city">{flight.origin}</div>
                      <div className="time">{formatDateTime(flight.departureTime)}</div>
                    </div>
                    <div className="route-line">
                      <div className="plane-icon">✈️</div>
                      <div className="duration">{calculateDuration(flight.departureTime, flight.arrivalTime)}</div>
                    </div>
                    <div className="route-item">
                      <div className="city">{flight.destination}</div>
                      <div className="time">{formatDateTime(flight.arrivalTime)}</div>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="price-section">
                      <span className="price">${flight.price}</span>
                      <span className="price-label">per person</span>
                    </div>
                    <div className="seats-section">
                      <span className="seats-count">{flight.availableSeats}</span>
                      <span className="seats-label">seats left</span>
                    </div>
                  </div>

                  <div className="flight-actions">
                    <button 
                      className="select-flight-button"
                      onClick={() => handleBookFlight(flight)}
                      disabled={!flight.available || flight.availableSeats === 0}
                    >
                      {flight.available && flight.availableSeats > 0 ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {flights.length === 0 && !loading && (
              <div className="no-flights">
                <div className="no-flights-icon">🔍</div>
                <h3>No flights found</h3>
                <p>Try adjusting your search criteria or browse all available flights.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;