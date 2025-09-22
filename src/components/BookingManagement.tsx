import React, { useState, useEffect } from 'react';
import { bookingService, type Booking } from '../services/bookingService';
import { flightService, type Flight } from '../services/flightService';
import './BookingManagement.css';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flightDetails, setFlightDetails] = useState<{ [key: number]: Flight }>({});

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const userBookings = await bookingService.getMyBookings();
      setBookings(userBookings);
      
      // Load flight details for each booking
      const flightDetailsMap: { [key: number]: Flight } = {};
      const allFlights = await flightService.getAllFlights();
      
      userBookings.forEach(booking => {
        const flight = allFlights.find(f => f.id === booking.flightId);
        if (flight) {
          flightDetailsMap[booking.flightId] = flight;
        }
      });
      
      setFlightDetails(flightDetailsMap);
    } catch (err: any) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBookingTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="booking-management-container">
        <div className="loading-bookings">
          <div className="booking-loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-management-container">
      <div className="booking-header">
        <h2 className="booking-title">
          <span className="booking-icon">📋</span>
          My Bookings
        </h2>
        <p className="booking-subtitle">Manage and view your flight reservations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="bookings-section">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">✈️</div>
            <h3>No bookings found</h3>
            <p>You haven't made any flight bookings yet. Start by searching for flights!</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => {
              const flight = flightDetails[booking.flightId];
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-id">
                      Booking #{booking.id}
                    </div>
                    <div className="booking-status">
                      <span className="status-badge confirmed">Confirmed</span>
                    </div>
                  </div>

                  {flight ? (
                    <>
                      <div className="booking-flight-info">
                        <div className="flight-number-large">
                          {flight.flightNumber}
                        </div>
                        <div className="flight-route-large">
                          <div className="route-city">{flight.origin}</div>
                          <div className="route-arrow">→</div>
                          <div className="route-city">{flight.destination}</div>
                        </div>
                      </div>

                      <div className="booking-details">
                        <div className="detail-row">
                          <span className="detail-label">Departure:</span>
                          <span className="detail-value">{formatDateTime(flight.departureTime)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Arrival:</span>
                          <span className="detail-value">{formatDateTime(flight.arrivalTime)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Seats:</span>
                          <span className="detail-value">{booking.seatsBooked}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Total Price:</span>
                          <span className="detail-value price">${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Booked on:</span>
                          <span className="detail-value">{formatBookingTime(booking.bookingTime)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flight-not-found">
                      <p>Flight details not available</p>
                      <div className="booking-details">
                        <div className="detail-row">
                          <span className="detail-label">Flight ID:</span>
                          <span className="detail-value">{booking.flightId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Seats:</span>
                          <span className="detail-value">{booking.seatsBooked}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Total Price:</span>
                          <span className="detail-value price">${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Booked on:</span>
                          <span className="detail-value">{formatBookingTime(booking.bookingTime)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="booking-actions">
                    <button className="view-details-button">
                      View Details
                    </button>
                    <button className="download-ticket-button">
                      Download Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;