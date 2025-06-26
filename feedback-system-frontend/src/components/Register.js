import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, UserPlus, Shield, Users, Mail } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onLogin = () => {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await axios.post('/register', formData);
      // Auto-login after registration
      const loginResponse = await axios.post('/login', {
        username: formData.username,
        password: formData.password
      });
      onLogin(loginResponse.data.user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
     
      <div className="relative w-full max-w-md">
        {/* Main register card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join us and get started</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent text-white backdrop-blur-sm transition-all duration-200 appearance-none"
                >
                  <option value="employee" className="bg-gray-800 text-white">Employee</option>
                  <option value="manager" className="bg-gray-800 text-white">Manager</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-slate-300 hover:text-white transition-colors duration-200 inline-flex items-center cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Role information card */}
        <div className="mt-4 bg-white/3 backdrop-blur-sm rounded-lg border border-white/5 p-4">
          <div className="text-center mb-3">
            <h3 className="text-sm font-medium text-gray-300 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1 text-gray-400" />
              Role Information
            </h3>
            <p className="text-xs text-gray-500 mt-1">Choose your account type</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full p-2 bg-white/5 border border-white/10 rounded-md">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <Shield className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-xs font-medium">Manager</p>
                  <p className="text-gray-500 text-xs">Full access & team management</p>
                </div>
              </div>
            </div>

            <div className="w-full p-2 bg-white/5 border border-white/10 rounded-md">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <Users className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-xs font-medium">Employee</p>
                  <p className="text-gray-500 text-xs">Standard user access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;