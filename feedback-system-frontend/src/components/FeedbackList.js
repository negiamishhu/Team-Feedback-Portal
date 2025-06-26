import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  User, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Edit,
  Check,
  Clock,
  Calendar,
  Award,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
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
      fetchFeedback();
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

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  

  const getSentimentBadgeClass = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'negative': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-lg">Loading feedback...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-200 font-medium text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-60  py-20">
      <div className=" ">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Feedback Center
                  </h1>
                  <p className="text-gray-300">
                    {user.role === 'manager' ? 'Manage team feedback and development' : 'View your feedback and growth opportunities'}
                  </p>
                </div>
              </div>
              {user.role === 'manager' && (
                <Link
                  to="/feedback/new"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Give New Feedback</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {feedback.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 shadow-2xl text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Feedback Yet</h3>
            <p className="text-gray-300">
              {user.role === 'manager' 
                ? "Start building a feedback culture by giving your first feedback."
                : "Your feedback will appear here once your manager provides it."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {feedback.map((feedbackItem) => (
              <div key={feedbackItem.id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Feedback Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        {user.role === 'manager' ? (
                          <User className="w-6 h-6 text-white" />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {user.role === 'manager' ? (
                            `To: ${feedbackItem.employee_name}`
                          ) : (
                            `From: ${feedbackItem.manager_name}`
                          )}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(feedbackItem.created_at).toLocaleDateString()}</span>
                          </div>
                          {feedbackItem.updated_at !== feedbackItem.created_at && (
                            <div className="flex items-center space-x-1">
                              <span>•</span>
                              <span>Updated: {new Date(feedbackItem.updated_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sentiment Badge */}
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border backdrop-blur-sm ${getSentimentBadgeClass(feedbackItem.sentiment)}`}>
                      {getSentimentIcon(feedbackItem.sentiment)}
                      <span className="font-medium capitalize">{feedbackItem.sentiment}</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-6 space-y-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">Strengths & Achievements</h4>
                    </div>
                    <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
                      <p className="text-gray-200 leading-relaxed">{feedbackItem.strengths}</p>
                    </div>
                  </div>

                  {/* Areas to Improve */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">Areas for Development</h4>
                    </div>
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                      <p className="text-gray-200 leading-relaxed">{feedbackItem.areas_to_improve}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    {/* Acknowledgment Status */}
                    <div className="flex items-center space-x-2">
                      {feedbackItem.acknowledged ? (
                        <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/50 rounded-lg backdrop-blur-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Acknowledged</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 rounded-lg backdrop-blur-sm">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Pending</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {user.role === 'manager' && (
                        <button
                          onClick={() => handleEdit(feedbackItem)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 transform hover:scale-105"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}
                      {user.role === 'employee' && !feedbackItem.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(feedbackItem.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <Check className="w-4 h-4" />
                          <span>Acknowledge</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <FeedbackModal
            feedback={editingFeedback}
            onClose={handleModalClose}
            onUpdate={handleFeedbackUpdate}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackList;