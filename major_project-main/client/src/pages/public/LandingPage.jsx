import { useTheme } from '../../context/ThemeContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { UpgradeButton } from '../../components/payment/UpgradeButton';
import { Code2, ArrowRight, Play, CheckCircle, MessageSquare, BarChart3, Zap, Users, Star, Sun, Moon, Activity, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const LandingPage = () => {
  const [activeCode, setActiveCode] = useState('javascript');
  const { isDark } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [paidPlans, setPaidPlans] = useState({});

  useEffect(() => {
    API.get('/payments/plans')
      .then((res) => {
        const byId = {};
        res.data.data.plans.forEach((plan) => { byId[plan.id] = plan; });
        setPaidPlans(byId);
      })
      .catch(() => setPaidPlans({}));
  }, []);

  const formatPrice = (plan, fallback) =>
    plan
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: plan.currency,
          maximumFractionDigits: 0,
        }).format(plan.amount / 100)
      : fallback;

  const codeExamples = {
    javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
  };

  const performanceData = [
    { metric: 'Communication', value: 88 },
    { metric: 'Algorithm Efficiency', value: 95 },
    { metric: 'Pacing & Tone', value: 82 },
    { metric: 'Code Quality', value: 91 },
    { metric: 'Problem Solving', value: 87 },
  ];

  const progressData = [
    { attempt: 'Attempt 1', score: 65 },
    { attempt: 'Attempt 2', score: 72 },
    { attempt: 'Attempt 3', score: 78 },
    { attempt: 'Attempt 4', score: 85 },
    { attempt: 'Attempt 5', score: 92 },
  ];

  const questions = [
    { company: 'Google', title: 'Two Sum', difficulty: 'Easy' },
    { company: 'Meta', title: 'LRU Cache', difficulty: 'Medium' },
    { company: 'Amazon', title: 'Merge Intervals', difficulty: 'Medium' },
    { company: 'Microsoft', title: 'Valid Parentheses', difficulty: 'Easy' },
    { company: 'Google', title: 'Binary Search', difficulty: 'Medium' },
    { company: 'Meta', title: 'Group Anagrams', difficulty: 'Medium' },
  ];

  const filteredQuestions = selectedCompany === 'All' 
    ? questions 
    : questions.filter(q => q.company === selectedCompany);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Videos */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-1/2 h-full object-cover opacity-20"
          style={{ filter: 'blur(2px)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-coding-on-laptop-screen-close-up-1728-large.mp4" type="video/mp4" />
        </video>
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20"
          style={{ filter: 'blur(2px)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-monitor-close-up-1727-large.mp4" type="video/mp4" />
        </video>
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute bottom-0 left-1/4 w-1/2 h-1/2 object-cover opacity-15"
          style={{ filter: 'blur(3px)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-27611-large.mp4" type="video/mp4" />
        </video>

        {/* Gradient Orbs */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-40 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' : 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'}`} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/10'}`}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Combined Header & Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative z-10 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
      >
      
        {/* Hero Content */}
        <div className="w-full px-4 py-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 ${isDark ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-green-100 border-green-200 text-green-700'} border rounded-full text-xs font-medium`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Preview Available • No signup required
              </div>
              <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
                Ace your next tech interview without the mock-interview anxiety
              </h1>
              <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                Practice real coding challenges out loud. Get instant AI voice feedback on your logic, pacing, and problem-solving before talking to a real interviewer.
              </p>
              <div className="flex items-start">
  <Link
    to="/register"
    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-indigo-500/50"
  >
    Create Your Free Account
    <ArrowRight className="w-5 h-5" />
  </Link>
</div>
            </motion.div>

            {/* Interactive Code Preview */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-xl border overflow-hidden shadow-2xl`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-200/50'}`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className={`text-xs ml-2 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>two-sum.js</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCode('javascript')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      activeCode === 'javascript' ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    JS
                  </button>
                  <button
                    onClick={() => setActiveCode('python')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      activeCode === 'python' ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>
              <div className={`p-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                <pre className={`text-sm font-mono leading-relaxed overflow-x-auto ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <code>{codeExamples[activeCode]}</code>
                </pre>
              </div>
              <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-200/30'} flex items-center justify-between`}>
                <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${isRunning ? 'text-green-400 animate-pulse' : 'text-green-400'}`} />
                    {isRunning ? 'Running tests...' : 'Tests passed'}
                  </span>
                  <span className={isRunning ? 'animate-pulse' : ''}>Runtime: {isRunning ? '...' : '52ms'}</span>
                </div>
                <button 
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`text-xs font-medium flex items-center gap-1 ${isRunning ? 'text-slate-400 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  {isRunning ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  {isRunning ? 'Running...' : 'Run code'}
                </button>
              </div>
              
              {/* Audio Waveform */}
              <div className={`px-4 py-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} bg-gradient-to-r ${isDark ? 'from-slate-900/50 to-slate-800/50' : 'from-slate-50 to-slate-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Voice Feedback Preview</span>
                </div>
                <div className="flex items-center gap-1 h-8">
                  {[40, 70, 45, 90, 55, 100, 65, 85, 40, 95, 50, 80, 30, 75, 60, 45, 80, 55, 70, 35].map((h, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`}
                      style={{ height: `${h}%` }}
                      animate={{
                        height: [`${h}%`, `${h * 0.5}%`, `${h}%`],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Social Proof */}
     {/* Social Proof */}
<section
  className="relative z-10 py-16 px-4 border-t border-slate-800 overflow-hidden"
  style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
>
  {/* Subtle grid overlay */}
  <div className="absolute inset-0 opacity-20"
    style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }}
  />
  {/* Glow orbs */}
  <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

  <div className="relative w-full">
    <div className="flex flex-col md:flex-row items-center justify-between gap-10">

      {/* Left: Trusted by */}
      <div className="text-center md:text-left">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-3">
          Trusted by engineers at
        </p>
        <div className="flex flex-wrap items-center gap-6">
          {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map((company) => (
            <span
              key={company}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Stats with dividers */}
      <div className="flex items-center">
        <div className="text-center px-8">
          <div className="text-3xl font-bold text-indigo-400">12,000+</div>
          <div className="text-xs text-slate-400 mt-1">Practice sessions</div>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="text-center px-8">
          <div className="text-3xl font-bold text-indigo-400">4.8/5</div>
          <div className="text-xs text-slate-400 mt-1">User rating</div>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="text-center px-8">
          <div className="text-3xl font-bold text-indigo-400">2,500+</div>
          <div className="text-xs text-slate-400 mt-1">Offers received</div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Features Section */}
      <motion.section 
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
      >
        <div className="w-full">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Everything you need to ace your next interview</h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI-driven voice & coding interview practice with real-time feedback</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Real-Time Voice & Speech Feedback */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-100'} rounded-xl flex items-center justify-center mb-4`}>
                <MessageSquare className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Real-Time Voice & Speech Feedback</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Speech-to-Text & Sentiment Analysis:</strong> Analyze clarity, speaking pace (words per minute), filler words ("um," "like"), and confidence levels.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Logic Explanation Evaluator:</strong> AI verifies whether your spoken explanation matches the code you are writing in real-time.</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 - AI Code Analysis & Optimization */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-green-500/10' : 'bg-green-100'} rounded-xl flex items-center justify-center mb-4`}>
                <Activity className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Code Analysis & Optimization</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Instant Complexity Breakdown:</strong> Real-time feedback on Big-O time and space complexity.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Edge-Case & Bug Detection:</strong> Identifies unhandled edge cases, potential memory leaks, or syntax bugs before test suites run.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Multi-Language Support:</strong> Practice in JavaScript, Python, Java, C++, TypeScript, and Go.</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 - Targeted Company Question Bank */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-purple-500/10' : 'bg-purple-100'} rounded-xl flex items-center justify-center mb-4`}>
                <Users className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Targeted Company Question Bank</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>FAANG & Top Tech Curated Packs:</strong> Real questions tagged by company (Google, Meta, Amazon, Microsoft), difficulty (Easy, Medium, Hard), and frequency.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Pattern-Based Practice:</strong> Filter by core patterns like Two Pointers, Dynamic Programming, Graphs, Sliding Window, and System Design.</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 4 - Detailed Performance Analytics */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-orange-500/10' : 'bg-orange-100'} rounded-xl flex items-center justify-center mb-4`}>
                <BarChart3 className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Detailed Performance Analytics</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Progress Tracking Dashboard:</strong> Visual charts mapping score improvements over multiple attempts.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Skill Radar Chart:</strong> Multi-axis scoring on Communication, Algorithm Efficiency, Code Quality, and Problem-Solving Speed.</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 5 - Mobile & Cross-Platform */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} rounded-xl flex items-center justify-center mb-4`}>
                <Zap className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Mobile & Cross-Platform</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Responsive Design:</strong> Practice on any device - desktop, tablet, or mobile with optimized experience.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Offline Mode:</strong> Download practice sessions for offline use when you don't have internet access.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Progress Sync:</strong> Your progress automatically syncs across all your devices.</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 6 - Security & Privacy */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <div className={`w-12 h-12 ${isDark ? 'bg-red-500/10' : 'bg-red-100'} rounded-xl flex items-center justify-center mb-4`}>
                <Star className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Security & Privacy</h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>End-to-End Encryption:</strong> Your code and voice recordings are encrypted and never shared.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Data Ownership:</strong> You have full control over your data with easy export and deletion options.</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>GDPR Compliant:</strong> Built with privacy-first principles and compliance with data protection regulations.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
      >
        <div className="w-full">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>How it works</h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Three simple steps to ace your next interview</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a practice mode',
                description: 'Select from coding challenges, voice interviews, or combined sessions. Pick your difficulty level and topic.',
                icon: <Code2 className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              },
              {
                step: '02',
                title: 'Practice with AI feedback',
                description: 'Solve problems while our AI provides real-time feedback on your code, communication, and problem-solving approach.',
                icon: <MessageSquare className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              },
              {
                step: '03',
                title: 'Review and improve',
                description: 'Get detailed performance reports, track your progress over time, and focus on areas that need improvement.',
                icon: <BarChart3 className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div className={`text-4xl font-bold mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.step}</div>
                <div className="mb-4">{item.icon}</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        id="pricing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
      >
        <div className="w-full">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Simple, transparent pricing</h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Choose the plan that fits your interview preparation needs</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Free Practice</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Casual / Beginners</p>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$0</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>3 Practice Sessions per month</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Standard Code Execution & Syntax Checks</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Basic FAANG Question Access</span>
                </li>
              </ul>
              <Link to="/register" className={`block w-full text-center px-6 py-3 border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} rounded-lg transition-colors text-sm font-medium`}>
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-indigo-500' : 'bg-white border-indigo-500'} rounded-2xl border-2 p-6 relative`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full">Most Popular</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro Evaluator</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Job Seekers</p>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatPrice(paidPlans.pro_monthly, '$19')}</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/month</span>
                <span className={`text-xs block ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>or {formatPrice(paidPlans.pro_yearly, '$149')}/yr</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Unlimited</strong> Voice & Code Practice Sessions</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Real-time Speech & Logic Feedback</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Full Company-Specific Question Bank</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Advanced Analytics & Progress Tracking</span>
                </li>
              </ul>
              <UpgradeButton
                planId="pro_monthly"
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Upgrade to Pro
              </UpgradeButton>
              <UpgradeButton
                planId="pro_yearly"
                className={`w-full mt-3 px-6 py-2 rounded-lg border text-xs font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                Pay yearly &amp; save
              </UpgradeButton>
              <p className={`text-xs text-center mt-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Secure checkout via Razorpay</p>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Team / Enterprise</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bootcamps & Recruiters</p>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Custom</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/seat</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Multi-seat License Dashboard</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Custom Interview Rubrics & Assessments</span>
                </li>
                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Candidate Performance Exporting</span>
                </li>
              </ul>
              <Link to="/contact" className={`block w-full text-center px-6 py-3 border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} rounded-lg transition-colors text-sm font-medium`}>
                Contact Sales
              </Link>
            </motion.div>
          </div>

          {/* FAQ Preview */}
          <motion.div variants={itemVariants} className={`mt-12 p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>?</span>
              </div>
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Can I practice without installing software?</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Yes, InterviewAI is 100% web-based. No downloads or installations required.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        id="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 border-t ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-100'}`}
      >
        <div className="w-full">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>What our users say</h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join thousands of engineers who've landed their dream jobs</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Jordan Davis',
                role: 'Senior Software Engineer at Meta',
                quote: 'The voice practice feature helped me get comfortable explaining my thought process out loud. I went from freezing up to confidently walking through my solutions.',
                initials: 'JD',
                gradient: 'from-indigo-500 to-purple-600',
                rating: 5
              },
              {
                name: 'Sarah Chen',
                role: 'Software Engineer at Google',
                quote: 'InterviewAI helped me identify gaps in my knowledge I didn\'t even know I had. The detailed feedback on my code quality was invaluable.',
                initials: 'SC',
                gradient: 'from-green-500 to-teal-600',
                rating: 5
              },
              {
                name: 'Michael Rodriguez',
                role: 'Tech Lead at Amazon',
                quote: 'I use InterviewAI to train my team. The progress tracking and company-specific questions have significantly improved our hiring success rate.',
                initials: 'MR',
                gradient: 'from-orange-500 to-red-600',
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-6`}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className={`text-base mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Featured Testimonial */}
          <motion.div variants={itemVariants} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-8 mt-8`}>
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className={`text-2xl font-medium mb-6 leading-relaxed text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              "The voice practice feature helped me get comfortable explaining my thought process out loud. I went from freezing up to confidently walking through my solutions. Landed a Senior role at Meta last month."
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div className="text-left">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Jordan Davis</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Senior Software Engineer at Meta</div>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>Verified Hire</span>
                </div>
              </div>
            </div>
            
            {/* Audio Clip Snippet */}
            <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-xl p-4 flex items-center gap-4`}>
              <button className={`w-12 h-12 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center hover:scale-105 transition-transform`}>
                <Play className="w-5 h-5 text-white ml-0.5" />
              </button>
              <div className="flex-1">
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Listen to Jordan's experience</div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0:30 • How InterviewAI helped me prepare</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
      >
        <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto text-center space-y-6">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ready to practice?</h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Start with a free 2-minute practice session. No signup required.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/ai-interview/practice"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
            >
              Start Practice Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Want to save your progress? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Create free account</Link>
          </p>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className={`relative z-10 py-20 px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}
      >
        <div className="w-full max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequently asked questions</h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Everything you need to know about InterviewAI</p>
          </motion.div>
          
          <div className="space-y-4">
            {[
              {
                question: 'Is InterviewAI free to use?',
                answer: 'Yes! You can start with free practice sessions without creating an account. For advanced features like progress tracking and unlimited sessions, we offer affordable premium plans starting at $19/month.'
              },
              {
                question: 'How does the voice feedback work?',
                answer: 'Our AI uses advanced speech recognition to analyze your verbal explanations during interviews. It provides feedback on clarity, pacing, confidence, and communication effectiveness, helping you improve your soft skills.'
              },
              {
                question: 'Can I practice for specific companies?',
                answer: 'Absolutely. Our question bank includes real interview questions from top tech companies like Google, Meta, Amazon, and more. You can filter questions by company to practice for your target employer.'
              },
              {
                question: 'How accurate is the code analysis?',
                answer: 'Our code analysis is highly accurate and based on industry best practices. It analyzes time complexity, space complexity, code style, and potential bugs, providing actionable feedback to improve your coding skills.'
              },
              {
                question: 'Can I track my progress over time?',
                answer: 'Yes, with a free account you can track your progress across sessions, see improvement trends, and identify areas that need more practice. Our analytics help you focus on what matters most.'
              },
              {
                question: 'Can I practice without installing software?',
                answer: 'Yes, InterviewAI is 100% web-based. No downloads or installations required. Simply open your browser and start practicing immediately.'
              },
              {
                question: 'What programming languages are supported?',
                answer: 'We support JavaScript, Python, Java, C++, TypeScript, and Go. Our AI provides language-specific feedback and best practices for each supported language.'
              },
              {
                question: 'Is my data and code secure?',
                answer: 'Absolutely. We use end-to-end encryption for all your code and voice recordings. Your data is never shared with third parties, and you have full control with easy export and deletion options. We are also GDPR compliant.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time with no questions asked. Your access will continue until the end of your billing period.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 7-day free trial for our Pro plan so you can try all features risk-free. If you\'re not satisfied within the first 30 days of a paid subscription, we offer a full refund.'
              },
              {
                question: 'Can I use InterviewAI for team training?',
                answer: 'Yes, we offer Team and Enterprise plans with multi-seat licenses, custom interview rubrics, and candidate performance exporting. Contact our sales team for custom pricing.'
              },
              {
                question: 'How does the 7-day free trial work?',
                answer: 'The 7-day free trial gives you full access to all Pro features including unlimited practice sessions, real-time feedback, and advanced analytics. No credit card required to start, and you can cancel anytime.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-6`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{faq.question}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className={`relative z-10 py-8 px-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>InterviewAI</span>
          </div>
          <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Link to="/about" className={`${isDark ? 'hover:text-white' : 'hover:text-slate-900'} transition-colors`}>About</Link>
            <Link to="/privacy" className={`${isDark ? 'hover:text-white' : 'hover:text-slate-900'} transition-colors`}>Privacy</Link>
            <Link to="/terms" className={`${isDark ? 'hover:text-white' : 'hover:text-slate-900'} transition-colors`}>Terms</Link>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>© 2024 InterviewAI</p>
        </div>
      </footer>
    </div>
  );
};
