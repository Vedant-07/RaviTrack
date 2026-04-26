import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={28} />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Ravi<span className="text-blue-600">Track</span>
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;