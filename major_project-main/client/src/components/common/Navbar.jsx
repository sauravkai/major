import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Code2,
  Bot,
  Video,
  Shield,
  UserCheck,
  LogOut,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  History,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, loginAsDemoRole, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleDemoSwitch = async (role) => {
    const res = await loginAsDemoRole(role);
    setRoleMenuOpen(false);
    if (!res?.success) return;

    if (role === 'candidate') navigate('/dashboard');
    else if (role === 'interviewer') navigate('/interviewer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
<div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-tight gradient-text">
              INTERVIEW.AI
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-mono -mt-1">
              PRO EVALUATOR
            </span>
          </div>
        </Link>
                {/* Center Nav Links */}
       <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
  <a href="/#features" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a>
  <a href="/#pricing" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</a>
  <a href="/#testimonials" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Reviews</a>
  <a href="/#faq" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>FAQ</a>
</nav>

        {/* User Role Switcher & Action Controls */}
        <div className="flex items-center gap-3"></div>

        {/* User Role Switcher & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-indigo-500/50 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="capitalize text-slate-200">
                Demo Role: <strong className="text-indigo-400">{user?.role || 'Guest'}</strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl py-2 border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[10px] font-mono text-slate-400 tracking-wider uppercase border-b border-slate-800 mb-1">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => handleDemoSwitch('candidate')}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Candidate View
                </button>
                <button
                  onClick={() => handleDemoSwitch('interviewer')}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-slate-200 hover:bg-purple-600/20 hover:text-purple-300"
                >
                  <Video className="w-3.5 h-3.5 text-purple-400" /> Interviewer View
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-slate-200 hover:bg-cyan-600/20 hover:text-cyan-300"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Admin View
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 group">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover group-hover:border-indigo-400"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
