import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Plus, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    if (user.role === 'manager') {
      fetchTeam();
    }
  }, []);

  const fetchDashboardData = async (employeeId = null) => {
    setLoading(true);
    try {
      let url = '/dashboard';
      if (employeeId) {
        url = `/dashboard?employee_id=${employeeId}`;
      }
      const response = await axios.get(url, { withCredentials: true });
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await axios.get('/users', { withCredentials: true });
      setTeam(response.data.users);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-500/50 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-60  py-20">
      {user.role === 'manager' && team.length > 0 && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Your Team</h2>
            <div className="flex flex-wrap gap-4">
              {team.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg border border-white/20 ${selectedEmployee && selectedEmployee.id === employee.id ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {employee.username} <span className="text-xs text-gray-300 ml-2">({employee.email})</span>
                </button>
              ))}
              <button
                onClick={() => setSelectedEmployee(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg border border-white/20 ${!selectedEmployee ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Show All
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-8 mt-8  ">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-gray-300 capitalize">
                  {user.role} Dashboard
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      {user.role === 'manager' ? (
        <ManagerDashboard 
          data={selectedEmployee && dashboardData ? {
            ...dashboardData,
            recent_feedback: dashboardData.recent_feedback.filter(f => f.employee_name === selectedEmployee.username),
          } : dashboardData} 
        />
      ) : (
        <EmployeeDashboard data={dashboardData} />
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color = "slate" }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-300 text-sm">{label}</p>
      </div>
      <div className={`w-12 h-12 bg-gradient-to-br from-${color}-600 to-${color}-700 rounded-lg flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const FeedbackItem = ({ feedback, isManager = false }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-200 border-green-500/50';
      case 'negative': return 'bg-red-500/20 text-red-200 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">
              {isManager ? feedback.employee_name : `From: ${feedback.manager_name}`}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
            {getSentimentIcon(feedback.sentiment)}
            <span className="capitalize">{feedback.sentiment}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {feedback.acknowledged ? (
            <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-200 border border-green-500/50 rounded-md text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Acknowledged</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-200 border border-yellow-500/50 rounded-md text-xs font-medium">
              <Clock className="w-3 h-3" />
              <span>Pending</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ to, children, icon: Icon, variant = "primary" }) => {
  const baseClasses = "flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-slate-600 to-gray-700 text-white hover:from-slate-700 hover:to-gray-800",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20"
  };

  return (
    <Link to={to} className={`${baseClasses} ${variants[variant]}`}>
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </Link>
  );
};

const ManagerDashboard = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          icon={Users} 
          value={data.team_size} 
          label="Team Members" 
          color="blue" 
        />
        <StatCard 
          icon={MessageSquare} 
          value={data.total_feedback} 
          label="Total Feedback Given" 
          color="slate" 
        />
        <StatCard 
          icon={ThumbsUp} 
          value={data.sentiment_counts.positive} 
          label="Positive Feedback" 
          color="green" 
        />
        <StatCard 
          icon={Minus} 
          value={data.sentiment_counts.neutral} 
          label="Neutral Feedback" 
          color="yellow" 
        />
        <StatCard 
          icon={ThumbsDown} 
          value={data.sentiment_counts.negative} 
          label="Negative Feedback" 
          color="red" 
        />
      </div>

      {/* Recent Feedback */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Recent Feedback</h3>
          </div>
          <ActionButton to="/feedback/new" icon={Plus}>
            Give New Feedback
          </ActionButton>
        </div>

        {data.recent_feedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-2">No feedback given yet</p>
            <p className="text-gray-400">Start by giving feedback to your team members!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.recent_feedback.map((feedback) => (
              <FeedbackItem key={feedback.id} feedback={feedback} isManager={true} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <ActionButton to="/feedback/new" icon={Plus} variant="primary">
            Give New Feedback
          </ActionButton>
          <ActionButton to="/feedback" icon={Eye} variant="secondary">
            View All Feedback
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          icon={Award} 
          value={data.total_feedback} 
          label="Total Feedback Received" 
          color="blue" 
        />
        <StatCard 
          icon={AlertCircle} 
          value={data.unacknowledged_count} 
          label="Unacknowledged" 
          color="yellow" 
        />
      </div>

      {/* Recent Feedback */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Recent Feedback</h3>
        </div>

        {data.recent_feedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-2">No feedback received yet</p>
            <p className="text-gray-400">Your manager will provide feedback soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.recent_feedback.map((feedback) => (
              <FeedbackItem key={feedback.id} feedback={feedback} isManager={false} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <ActionButton to="/feedback" icon={Eye} variant="primary">
            View All Feedback
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;