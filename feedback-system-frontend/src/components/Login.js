
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, UserPlus, Shield, Users } from 'lucide-react';
import axios from 'axios';
import { Link ,useNavigate } from 'react-router-dom';


const Login = ({ onLogin = () => {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await axios.post('/login', formData);
      onLogin(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      

      <div className="relative w-full max-w-md">
         <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
           <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

           {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
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

             <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

           <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link
  to="/register"
  className="font-medium text-slate-300 hover:text-white transition-colors duration-200 inline-flex items-center cursor-pointer"
>
                <UserPlus className="w-4 h-4 mr-1" />
                Create account
              </Link>
            </p>
          </div>
        </div>

         <div className="mt-4 bg-white/3 backdrop-blur-sm rounded-lg border border-white/5 p-4">
          <div className="text-center mb-3">
            <h3 className="text-sm font-medium text-gray-300 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1 text-gray-400" />
              demo accounts
            </h3>
            <p className="text-xs text-gray-500 mt-1">click to auto-fill</p>
          </div>
          
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('TheManager', '@12345')}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <Shield className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-xs font-medium">manager</p>
                  <p className="text-gray-500 text-xs">TheManager</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('Jack', '@123456')}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <Users className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-xs font-medium">employee</p>
                  <p className="text-gray-500 text-xs">Jack</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('Alex', '@1234567')}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <Users className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-xs font-medium">employee</p>
                  <p className="text-gray-500 text-xs">Alex</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;