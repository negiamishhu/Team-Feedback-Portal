import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackModal = ({ feedback, onClose, onUpdate, isEditing }) => {
  const [formData, setFormData] = useState({
    strengths: '',
    areas_to_improve: '',
    sentiment: 'positive'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (feedback) {
      setFormData({
        strengths: feedback.strengths,
        areas_to_improve: feedback.areas_to_improve,
        sentiment: feedback.sentiment
      });
    }
  }, [feedback]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.put(`/api/feedback/${feedback.id}`, formData);
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Feedback</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Strengths</label>
            <textarea
              name="strengths"
              className="form-control textarea"
              value={formData.strengths}
              onChange={handleChange}
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
              {loading ? 'Updating...' : 'Update Feedback'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal; 