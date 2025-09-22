import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'AIRLINE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState<string>('');

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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the internal create endpoint for admin operations
      const response = await fetch('http://localhost:8080/users/internal/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      if (response.ok) {
        setSuccess(`${formData.role} account created successfully!`);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'AIRLINE'
        });
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to create account');
      }
    } catch (err: any) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Access control - only ADMIN role can access admin panel
  if (userRole !== 'ADMIN') {
    return (
      <div className="admin-panel-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Admin Access Required</h2>
          <p>You need administrator privileges to access this panel.</p>
          <div className="access-info">
            <h4>Administrator Features:</h4>
            <ul>
              <li>Create AIRLINE accounts for airline companies</li>
              <li>Create additional ADMIN accounts</li>
              <li>Manage system-wide settings</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2 className="admin-title">
          <span className="admin-icon">👨‍💼</span>
          Admin Panel
        </h2>
        <p className="admin-subtitle">Create airline and admin accounts</p>
      </div>

      <div className="admin-form-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <h3>Create New Account</h3>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="role-select"
              required
            >
              <option value="AIRLINE">Airline Company</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <p className="role-description">
              {formData.role === 'AIRLINE' 
                ? 'Airline accounts can manage flights, add routes, and update schedules.'
                : 'Admin accounts have full system access and can create other accounts.'
              }
            </p>
          </div>

          <button 
            type="submit" 
            className="create-account-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Create ${formData.role} Account`}
          </button>
        </form>

        <div className="admin-info">
          <h4>Account Types:</h4>
          <div className="account-types">
            <div className="account-type">
              <strong>✈️ Airline:</strong> Can manage flights, schedules, and pricing
            </div>
            <div className="account-type">
              <strong>👨‍💼 Admin:</strong> Full system access, can create accounts
            </div>
            <div className="account-type">
              <strong>👤 User:</strong> Can search and book flights (created via public registration)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;