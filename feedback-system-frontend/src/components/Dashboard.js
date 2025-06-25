import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>
        Welcome, {user.username}!
      </h1>

      {user.role === 'manager' ? (
        <ManagerDashboard data={dashboardData} />
      ) : (
        <EmployeeDashboard data={dashboardData} />
      )}
    </div>
  );
};

const ManagerDashboard = ({ data }) => {
  return (
    <div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{data.team_size}</div>
          <div className="stat-label">Team Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.total_feedback}</div>
          <div className="stat-label">Total Feedback Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.sentiment_counts.positive}</div>
          <div className="stat-label">Positive Feedback</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.sentiment_counts.neutral}</div>
          <div className="stat-label">Neutral Feedback</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.sentiment_counts.negative}</div>
          <div className="stat-label">Negative Feedback</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Feedback</h3>
          <Link to="/feedback/new" className="btn btn-primary">
            Give New Feedback
          </Link>
        </div>

        {data.recent_feedback.length === 0 ? (
          <p>No feedback given yet. Start by giving feedback to your team members!</p>
        ) : (
          <div>
            {data.recent_feedback.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-header">
                  <div>
                    <strong>{feedback.employee_name}</strong>
                    <div className="feedback-meta">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`sentiment-badge sentiment-${feedback.sentiment}`}>
                    {feedback.sentiment}
                  </span>
                </div>
                <div>
                  {feedback.acknowledged ? (
                    <span className="sentiment-badge sentiment-positive">Acknowledged</span>
                  ) : (
                    <span className="sentiment-badge sentiment-neutral">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/feedback/new" className="btn btn-primary">
            Give New Feedback
          </Link>
          <Link to="/feedback" className="btn btn-secondary">
            View All Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = ({ data }) => {
  return (
    <div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{data.total_feedback}</div>
          <div className="stat-label">Total Feedback Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.unacknowledged_count}</div>
          <div className="stat-label">Unacknowledged</div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Feedback</h3>
        {data.recent_feedback.length === 0 ? (
          <p>No feedback received yet.</p>
        ) : (
          <div>
            {data.recent_feedback.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-header">
                  <div>
                    <strong>From: {feedback.manager_name}</strong>
                    <div className="feedback-meta">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`sentiment-badge sentiment-${feedback.sentiment}`}>
                    {feedback.sentiment}
                  </span>
                </div>
                <div>
                  {feedback.acknowledged ? (
                    <span className="sentiment-badge sentiment-positive">Acknowledged</span>
                  ) : (
                    <span className="sentiment-badge sentiment-neutral">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/feedback" className="btn btn-primary">
            View All Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 