import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  User,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

const RequestFeedback = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/feedback-request', { message }, { withCredentials: true });
      setSuccess('Feedback request sent successfully! Your manager will be notified.');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-60 py-20">
      <div className=" ">
         <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Request Feedback
                  </h1>
                  <p className="text-gray-300">
                    Ask your manager for constructive feedback on your performance
                  </p>
                </div>
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

        {success && (
          <div className="mb-6 bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-medium">{success}</p>
            </div>
          </div>
        )}

         <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8">
             

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                  <MessageCircle className="w-5 h-5" />
                  <span>Your Message (Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Hi [Manager's Name], I would appreciate your feedback on my recent work, particularly on [specific project/skill]. Any insights on areas where I can improve would be very helpful. Thank you!"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={6}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {message.length}/500
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Add context about what specific feedback you're looking for or mention recent projects you'd like input on.
                </p>
              </div>

               {message.trim() && (
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-white font-semibold text-lg">
                    <User className="w-5 h-5" />
                    <span>Message Preview</span>
                  </label>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-300 mb-1">Your feedback request:</div>
                        <div className="text-white text-sm leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                          "{message}"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

               <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Feedback Request</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
  
      </div>
    </div>
  );
};

export default RequestFeedback;