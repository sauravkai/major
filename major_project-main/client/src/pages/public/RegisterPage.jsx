import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Shield, Video, UserCheck, ArrowRight, Eye, EyeOff, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { register, registerWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const res = await register(formData);
    setIsLoading(false);
    if (res?.success) {
      if (formData.role === 'interviewer') navigate('/interviewer/dashboard');
      else navigate('/dashboard');
    } else {
      setError(res?.message || 'Registration failed');
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError('');
    const res = await registerWithGoogle();
    setIsLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    } else {
      setError(res?.message || 'Google registration failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-purple-500/20' : 'bg-purple-200/30'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-200/30'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-pink-500/10' : 'bg-pink-200/20'}`} style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl space-y-6 relative z-10 ${isDark ? 'bg-slate-900/80 border-slate-800/50' : 'bg-white border-slate-200'}`}
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`absolute top-4 right-4 p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'} transition-colors`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <UserPlus className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
          <h2 className={`text-3xl font-heading font-extrabold ${isDark ? 'text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300' : 'text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600'}`}>Create Account</h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join the next-gen AI Interview Platform</p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${isDark ? 'bg-rose-950/50 border border-rose-800/50 text-rose-300' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}
          >
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
            {error}
          </motion.div>
        )}

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
          {/* Google Registration Button */}
          <motion.button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl border font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
            </div>
            <div className={`relative flex justify-center text-xs uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className={`px-2 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>Or register with email</span>
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Account Persona</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'candidate' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'candidate'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : isDark 
                      ? 'bg-slate-950/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Candidate
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'interviewer' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'interviewer'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : isDark
                      ? 'bg-slate-950/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Video className="w-4 h-4" /> Interviewer
              </motion.button>
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
            <div className="relative group">
              <User className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivera"
                className={`w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-sans transition-all ${isDark ? 'bg-slate-950/50 border border-slate-700/50 text-slate-200' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
            <div className="relative group">
              <Mail className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
                className={`w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-sans transition-all ${isDark ? 'bg-slate-950/50 border border-slate-700/50 text-slate-200' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <div className="relative group">
              <Lock className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-sans transition-all ${isDark ? 'bg-slate-950/50 border border-slate-700/50 text-slate-200' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </>
            ) : (
              <>
                Create Account & Join <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className={`text-center text-sm pt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Already registered?{' '}
          <Link to="/login" className={`font-semibold underline decoration-indigo-400/30 hover:decoration-indigo-400 underline-offset-4 transition-all ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
            Sign in here
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
