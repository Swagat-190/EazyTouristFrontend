import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { authService } from './services/authService';
import './App.css';

type AuthMode = 'login' | 'register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthMode('login');
  };

  const handleRegisterSuccess = () => {
    // After successful registration, switch to login
    setAuthMode('login');
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      {authMode === 'login' ? (
        <Login
          onSwitchToRegister={switchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register
          onSwitchToLogin={switchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}

export default App;
