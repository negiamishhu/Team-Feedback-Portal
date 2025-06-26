import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Home, 
  MessageSquare, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Users,
  Sparkles
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-white/20 group"
    >
      {Icon && <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />}
      {children}
    </Link>
  );

  return (
    <>
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-24">
 
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-white font-bold text-xl hover:text-slate-300 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block">Feedback System</span>
            </Link>

             <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/dashboard" icon={Home}>
                Dashboard
              </NavLink>
              
              <NavLink to="/feedback" icon={MessageSquare}>
                Feedback
              </NavLink>
              
              {user.role === 'manager' && (
                <NavLink to="/feedback/new" icon={Plus}>
                  New Feedback
                </NavLink>
              )}
            </div>

             <div className="hidden md:flex items-center space-x-4">
              {/* User Badge */}
              <div className="flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center mr-3 shadow-md">
                  {user.role === 'manager' ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : (
                    <Users className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-lg shadow-lg hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            
          </div>
        </div>
 
      </nav>

       <div className="h-16"></div>
    </>
  );
};

export default Navbar;