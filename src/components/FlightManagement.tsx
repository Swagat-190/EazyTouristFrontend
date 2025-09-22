import React, { useState, useEffect } from 'react';
import { flightService, type Flight } from '../services/flightService';
import './FlightManagement.css';

const FlightManagement: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  const [formData, setFormData] = useState<Omit<Flight, 'id'>>({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    available: true,
    availableSeats: 0
  });

  useEffect(() => {
    // Check user role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || 'USER');
      } catch (error) {
        console.error('Error parsing token:', error);
        setUserRole('USER');
      }
    }
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    try {
      const flightList = await flightService.getAllFlights();
      setFlights(flightList);
    } catch (err: any) {
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0 
              : value
    }));
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: 0,
      available: true,
      availableSeats: 0
    });
    setEditingFlight(null);
    setShowAddForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingFlight) {
        await flightService.updateFlight(editingFlight.id!, formData);
        setSuccess('Flight updated successfully!');
      } else {
        await flightService.addFlight(formData);
        setSuccess('Flight added successfully!');
      }
      
      await loadFlights();
      resetForm();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save flight');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flight: Flight) => {
    setFormData({
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      available: flight.available,
      availableSeats: flight.availableSeats
    });
    setEditingFlight(flight);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return;
    }

    setLoading(true);
    try {
      await flightService.deleteFlight(id);
      setSuccess('Flight deleted successfully!');
      await loadFlights();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to delete flight');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = async (id: number, newSeats: number) => {
    try {
      await flightService.updateSeats(id, newSeats);
      setSuccess('Seats updated successfully!');
      await loadFlights();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update seats');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Access control - only AIRLINE role can manage flights
  if (userRole !== 'AIRLINE' && userRole !== 'ADMIN') {
    return (
      <div className="flight-management-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You need to have an AIRLINE role to manage flights.</p>
          <div className="access-info">
            <h4>How to get AIRLINE access:</h4>
            <ul>
              <li>Contact an administrator to create an AIRLINE account for you</li>
              <li>Administrators can create AIRLINE accounts through the Admin Panel</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-management-container">
      <div className="management-header">
        <h2 className="management-title">
          <span className="airline-icon">🛫</span>
          Flight Management
        </h2>
        <button 
          className="add-flight-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Flight
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="flight-form-modal">
            <div className="modal-header">
              <h3>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h3>
              <button className="close-button" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="flight-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="flightNumber">Flight Number</label>
                  <input
                    type="text"
                    id="flightNumber"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., AI101"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="origin">Origin</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    placeholder="Departure city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destination">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Arrival city"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureTime">Departure Time</label>
                  <input
                    type="datetime-local"
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="arrivalTime">Arrival Time</label>
                  <input
                    type="datetime-local"
                    id="arrivalTime"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="availableSeats">Available Seats</label>
                  <input
                    type="number"
                    id="availableSeats"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label htmlFor="available">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                    />
                    Flight Available
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : (editingFlight ? 'Update Flight' : 'Add Flight')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flights-table-container">
        <table className="flights-table">
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.id}>
                <td className="flight-number-cell">{flight.flightNumber}</td>
                <td className="route-cell">
                  {flight.origin} → {flight.destination}
                </td>
                <td>{formatDateTime(flight.departureTime)}</td>
                <td>{formatDateTime(flight.arrivalTime)}</td>
                <td className="price-cell">${flight.price}</td>
                <td className="seats-cell">
                  <input
                    type="number"
                    value={flight.availableSeats}
                    onChange={(e) => handleUpdateSeats(flight.id!, parseInt(e.target.value))}
                    className="seats-input"
                    min="0"
                  />
                </td>
                <td>
                  <span className={`status-badge ${flight.available ? 'available' : 'unavailable'}`}>
                    {flight.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(flight)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(flight.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {flights.length === 0 && !loading && (
          <div className="no-flights-management">
            <div className="no-flights-icon">✈️</div>
            <h3>No flights found</h3>
            <p>Start by adding your first flight.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightManagement;