import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/dashboard" className="navbar-brand">
            Feedback System
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
            {user.role === 'manager' && (
              <li>
                <Link to="/feedback/new">New Feedback</Link>
              </li>
            )}
            <li>
              <span style={{ color: '#fff', marginRight: '10px' }}>
                Welcome, {user.username} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 