import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageCircle,
  Calendar,
  Send,
  RefreshCw,
  Inbox,
  Users
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedbackRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/feedback-requests', { withCredentials: true });
      setRequests(res.data.requests);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error('Fetch requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleGiveFeedback = (employeeId, employeeName) => {
    navigate('/feedback/new');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span className="ml-3 text-white">Loading requests...</span>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Inbox className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Feedback Requests</h3>
      <p className="text-gray-300">There are no pending feedback requests at this time.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-60 py-20">
      <div className=" ">
      
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Feedback Requests
                  </h1>
                  <p className="text-gray-300">
                    Manage incoming feedback requests from your team
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                  <Users className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-300 text-sm font-medium">
                    {requests.length} Request{requests.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

         {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

         <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {requests.map((req, index) => (
                  <div
                    key={req.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {req.employee_name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(req.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/50 rounded-full">
                          <span className="text-blue-200 text-xs font-medium">Pending</span>
                        </div>
                      </div>
                    </div>

                    {req.message && (
                      <div className="mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              "{req.message}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Requested {formatDate(req.created_at)}</span>
                      </div>
                      <button
                        onClick={() => handleGiveFeedback(req.employee_id, req.employee_name)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        <span>Give Feedback</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

         {requests.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-xl">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">
                  {requests.length} Pending Request{requests.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Ready to Review</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackRequests;