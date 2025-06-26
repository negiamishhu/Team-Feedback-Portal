import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FeedbackModal from './FeedbackModal';

const FeedbackList = ({ user }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('/feedback');
      setFeedback(response.data.feedback);
    } catch (error) {
      setError('Failed to load feedback');
      console.error('Feedback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (feedbackId) => {
    try {
      await axios.post(`/feedback/${feedbackId}/acknowledge`);
      fetchFeedback(); // Refresh the list
    } catch (error) {
      console.error('Acknowledge error:', error);
    }
  };

  const handleEdit = (feedbackItem) => {
    setEditingFeedback(feedbackItem);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingFeedback(null);
  };

  const handleFeedbackUpdate = () => {
    fetchFeedback();
    handleModalClose();
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Feedback</h1>
        {user.role === 'manager' && (
          <Link to="/feedback/new" className="btn btn-primary">
            Give New Feedback
          </Link>
        )}
      </div>

      {feedback.length === 0 ? (
        <div className="card">
          <p>No feedback found.</p>
        </div>
      ) : (
        <div>
          {feedback.map((feedbackItem) => (
            <div key={feedbackItem.id} className={`feedback-item ${feedbackItem.sentiment}`}>
              <div className="feedback-header">
                <div>
                  {user.role === 'manager' ? (
                    <strong>To: {feedbackItem.employee_name}</strong>
                  ) : (
                    <strong>From: {feedbackItem.manager_name}</strong>
                  )}
                  <div className="feedback-meta">
                    {new Date(feedbackItem.created_at).toLocaleDateString()}
                    {feedbackItem.updated_at !== feedbackItem.created_at && (
                      <span> (Updated: {new Date(feedbackItem.updated_at).toLocaleDateString()})</span>
                    )}
                  </div>
                </div>
                <span className={`sentiment-badge sentiment-${feedbackItem.sentiment}`}>
                  {feedbackItem.sentiment}
                </span>
              </div>

              <div className="feedback-content">
                <h4>Strengths</h4>
                <p>{feedbackItem.strengths}</p>

                <h4>Areas to Improve</h4>
                <p>{feedbackItem.areas_to_improve}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <div>
                  {feedbackItem.acknowledged ? (
                    <span className="sentiment-badge sentiment-positive">Acknowledged</span>
                  ) : (
                    <span className="sentiment-badge sentiment-neutral">Pending</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {user.role === 'manager' && (
                    <button
                      onClick={() => handleEdit(feedbackItem)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                  )}
                  {user.role === 'employee' && !feedbackItem.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(feedbackItem.id)}
                      className="btn btn-success"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FeedbackModal
          feedback={editingFeedback}
          onClose={handleModalClose}
          onUpdate={handleFeedbackUpdate}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default FeedbackList; 