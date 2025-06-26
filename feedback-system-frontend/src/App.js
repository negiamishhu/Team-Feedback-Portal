import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FeedbackList from './components/FeedbackList';
import FeedbackForm from './components/FeedbackForm';
import TeamPicker from './components/TeamPicker';
import RequestFeedback from './components/RequestFeedback';
import FeedbackRequests from './components/FeedbackRequests';
import './App.css';

// Set up axios defaults
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        if (process.env.NODE_ENV === "development") {
          await axios.post(`${API_URL}/init-db`);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error initializing database:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={logout} />}
        <div className=" ">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/feedback" 
              element={user ? <FeedbackList user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/feedback/new" 
              element={user ? <FeedbackForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/team-picker" 
              element={<TeamPicker />} 
            />
            <Route 
              path="/request-feedback" 
              element={<RequestFeedback />} 
            />
            <Route 
              path="/feedback-requests" 
              element={<FeedbackRequests />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 