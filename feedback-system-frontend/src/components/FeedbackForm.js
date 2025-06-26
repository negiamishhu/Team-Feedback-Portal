import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    strengths: '',
    areas_to_improve: '',
    sentiment: 'positive'
  });
  const [employees, setEmployees] = useState([ ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/users');
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
      await axios.post('/feedback', formData);
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

  const handleBack = () => {
    navigate('/feedback');  
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-5 h-5" />;
      case 'negative': return <ThumbsDown className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'from-green-600 to-green-700';
      case 'negative': return 'from-red-600 to-red-700';
      default: return 'from-yellow-600 to-yellow-700';
    }
  };

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
                    Give Feedback
                  </h1>
                  <p className="text-gray-300">
                    Share constructive feedback with your team members
                  </p>
                </div>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Employee Selection */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                <Users className="w-5 h-5" />
                <span>Select Employee</span>
              </label>
              <div className="relative">
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
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                <Award className="w-5 h-5" />
                <span>Strengths & Positive Contributions</span>
              </label>
              <textarea
                name="strengths"
                className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
                value={formData.strengths}
                onChange={handleChange}
                placeholder="Highlight the employee's key strengths, achievements, and positive contributions to the team..."
                rows="4"
                required
              />
            </div>

            {/* Areas to Improve */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                <Target className="w-5 h-5" />
                <span>Areas for Development</span>
              </label>
              <textarea
                name="areas_to_improve"
                className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
                value={formData.areas_to_improve}
                onChange={handleChange}
                placeholder="Suggest areas where the employee could grow, develop new skills, or improve performance..."
                rows="4"
                required
              />
            </div>

            {/* Sentiment Selection */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                <Activity className="w-5 h-5" />
                <span>Overall Sentiment</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['positive', 'neutral', 'negative'].map((sentiment) => (
                  <label
                    key={sentiment}
                    className={`relative cursor-pointer group transition-all duration-200 ${
                      formData.sentiment === sentiment 
                        ? 'transform scale-105' 
                        : 'hover:scale-102'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sentiment"
                      value={sentiment}
                      checked={formData.sentiment === sentiment}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`
                      p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm
                      ${formData.sentiment === sentiment
                        ? `bg-gradient-to-br ${getSentimentColor(sentiment)} border-white/30 shadow-lg`
                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }
                    `}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${formData.sentiment === sentiment 
                            ? 'bg-white/20' 
                            : 'bg-white/10'
                          }
                        `}>
                          {getSentimentIcon(sentiment)}
                        </div>
                        <span className="text-white font-medium capitalize">
                          {sentiment}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 sm:flex-none px-6 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;