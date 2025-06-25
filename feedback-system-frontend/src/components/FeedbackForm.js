import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = ({ user }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    strengths: '',
    areas_to_improve: '',
    sentiment: 'positive'
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/users');
      setEmployees(response.data.users);
    } catch (error) {
      setError('Failed to load employees');
      console.error('Employees error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/feedback', formData);
      setSuccess('Feedback submitted successfully!');
      setTimeout(() => {
        navigate('/feedback');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Give Feedback</h1>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee</label>
            <select
              name="employee_id"
              className="form-control"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.username} ({employee.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Strengths</label>
            <textarea
              name="strengths"
              className="form-control textarea"
              value={formData.strengths}
              onChange={handleChange}
              placeholder="What are the employee's key strengths and positive contributions?"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Areas to Improve</label>
            <textarea
              name="areas_to_improve"
              className="form-control textarea"
              value={formData.areas_to_improve}
              onChange={handleChange}
              placeholder="What areas could the employee work on or develop further?"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Overall Sentiment</label>
            <select
              name="sentiment"
              className="form-control"
              value={formData.sentiment}
              onChange={handleChange}
              required
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/feedback')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm; 