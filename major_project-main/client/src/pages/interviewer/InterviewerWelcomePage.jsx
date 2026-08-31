import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Video, 
  Calendar, 
  Users, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Plus,
  Settings,
  FileText,
  Award,
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export const InterviewerWelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user, redirect to register
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calendar,
      title: 'Schedule Interviews',
      description: 'Create and manage interview sessions with candidates',
      color: 'from-indigo-500 to-blue-500',
      link: '/interviewer/dashboard'
    },
    {
      icon: Video,
      title: 'Live Interview Rooms',
      description: 'Conduct real-time coding interviews with built-in IDE',
      color: 'from-purple-500 to-pink-500',
      link: '/interviewer/dashboard'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'View detailed performance reports and candidate evaluations',
      color: 'from-emerald-500 to-teal-500',
      link: '/interviewer/dashboard'
    }
  ];

  const steps = [
    { icon: CheckCircle2, text: 'Set up your interviewer profile' },
    { icon: Plus, text: 'Schedule your first interview session' },
    { icon: Users, text: 'Invite candidates to interview rooms' },
    { icon: Award, text: 'Review AI-assisted evaluation reports' }
  ];

  const quickActions = [
    {
      icon: Plus,
      title: 'Schedule New Interview',
      description: 'Create a new interview session',
      action: 'schedule'
    },
    {
      icon: Users,
      title: 'View Candidates',
      description: 'See all scheduled candidates',
      action: 'candidates'
    },
    {
      icon: FileText,
      title: 'Problem Bank',
      description: 'Browse coding problems',
      action: 'problems'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-500 p-1 mx-auto mb-6 shadow-2xl shadow-indigo-500/30"
          >
            <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center">
              <Video className="w-12 h-12 text-indigo-600" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Welcome to the Interviewer Portal,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {user?.name || 'Interviewer'}!
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            You're all set to conduct professional technical interviews. Our AI-powered tools will help you evaluate candidates efficiently and accurately.
          </motion.p>
        </div>

        {/* Getting Started Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-500" /> Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 cursor-pointer group"
            >
              <Link to={feature.link} className="block">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-4 shadow-lg`}>
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                    <feature.icon className={`w-7 h-7 text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-indigo-600 font-semibold text-sm">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:border-indigo-300 transition-all text-left"
              >
                <action.icon className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-xs text-slate-600">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <Link
            to="/interviewer/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-2xl shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Start conducting interviews with AI-powered assistance
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
