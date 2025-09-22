import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import FlightSearch from './FlightSearch';
import FlightManagement from './FlightManagement';
import BookingManagement from './BookingManagement';
import AdminPanel from './AdminPanel';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

type ViewMode = 'home' | 'search' | 'manage' | 'bookings' | 'admin';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get user info from localStorage or API to determine role
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
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'search':
        return <FlightSearch />;
      case 'manage':
        return <FlightManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <div className="dashboard-home">
            <div className="welcome-section">
              <h2>Welcome to EazyTourist!</h2>
              <p>Your comprehensive travel companion for booking flights and planning amazing journeys.</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card" onClick={() => setCurrentView('search')}>
                <div className="feature-icon">🔍</div>
                <h3>Search Flights</h3>
                <p>Find and compare flights from different airlines to get the best deals.</p>
                <button className="feature-button">Search Now</button>
              </div>
              
              {(userRole === 'AIRLINE' || userRole === 'ADMIN') && (
                <div className="feature-card" onClick={() => setCurrentView('manage')}>
                  <div className="feature-icon">✈️</div>
                  <h3>Manage Flights</h3>
                  <p>Add, edit, and manage flight schedules (for airline partners).</p>
                  <button className="feature-button">Manage Flights</button>
                </div>
              )}
              
              <div className="feature-card" onClick={() => setCurrentView('bookings')}>
                <div className="feature-icon">📋</div>
                <h3>My Bookings</h3>
                <p>View and manage your flight reservations and tickets.</p>
                <button className="feature-button">View Bookings</button>
              </div>
              
              {userRole === 'ADMIN' && (
                <div className="feature-card" onClick={() => setCurrentView('admin')}>
                  <div className="feature-icon">⚙️</div>
                  <h3>Admin Panel</h3>
                  <p>Create airline and admin accounts for system management.</p>
                  <button className="feature-button">Admin Access</button>
                </div>
              )}
              
              <div className="feature-card">
                <div className="feature-icon">🏨</div>
                <h3>Find Hotels</h3>
                <p>Browse and book accommodations that suit your preferences.</p>
                <button className="feature-button">Coming Soon</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Local Experiences</h3>
                <p>Explore local attractions and activities at your destination.</p>
                <button className="feature-button">Coming Soon</button>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Airlines</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Destinations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title" onClick={() => setCurrentView('home')}>
            🌍 EazyTourist
          </h1>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-button ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentView('home')}
            >
              Home
            </button>
            <button 
              className={`nav-button ${currentView === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentView('search')}
            >
              Search Flights
            </button>
            {(userRole === 'AIRLINE' || userRole === 'ADMIN') && (
              <button 
                className={`nav-button ${currentView === 'manage' ? 'active' : ''}`}
                onClick={() => setCurrentView('manage')}
              >
                Manage Flights
              </button>
            )}
            <button 
              className={`nav-button ${currentView === 'bookings' ? 'active' : ''}`}
              onClick={() => setCurrentView('bookings')}
            >
              My Bookings
            </button>
            {userRole === 'ADMIN' && (
              <button 
                className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                Admin
              </button>
            )}
          </nav>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;