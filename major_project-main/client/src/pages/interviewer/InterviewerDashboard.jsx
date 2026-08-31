import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Video, Calendar, Plus, Users, Search, Code2, Award, Clock, Sparkles, CheckCircle2, Copy, Link as LinkIcon, Filter, Tag, Target, Zap, BarChart3, BookOpen, Flame, TrendingUp } from 'lucide-react';
import API from '../../services/api';

export const InterviewerDashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([
    {
      _id: 'demo-101',
      title: 'Senior React Developer Round',
      candidateName: 'Alex Rivera',
      candidateEmail: 'alex.rivera@example.com',
      role: 'Full Stack',
      time: 'Now Live',
      roomId: 'demo-101',
      status: 'Live',
      problemTitle: 'Two Sum',
      sessionId: 'sess_x7k2m9',
      questionsAsked: 2,
      totalQuestions: 3
    },
    {
      _id: 'demo-102',
      title: 'Backend Node.js & Docker Evaluation',
      candidateName: 'Jordan Lee',
      candidateEmail: 'jordan.lee@example.com',
      role: 'Backend Engineer',
      time: 'Today, 4:00 PM',
      roomId: 'demo-102',
      status: 'Scheduled',
      problemTitle: 'Valid Parentheses',
      sessionId: 'sess_a3b8c2',
      questionsAsked: 0,
      totalQuestions: 3
    }
  ]);

  const [previousInterviews, setPreviousInterviews] = useState([
    {
      _id: 'prev-001',
      title: 'Frontend Architecture Assessment',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@example.com',
      role: 'Frontend Engineer',
      completedDate: '2024-01-15',
      duration: '52 min',
      roomId: 'room-abc123',
      sessionId: 'sess_9x8y7z',
      problemTitle: 'Merge Intervals',
      overallScore: 85,
      status: 'Completed',
      questionsAsked: 3,
      totalQuestions: 3,
      feedback: {
        strengths: ['Strong problem-solving skills', 'Clean code structure', 'Good communication'],
        improvements: ['Could optimize time complexity', 'Consider edge cases more thoroughly'],
        rating: 4.2
      },
      technicalSkills: {
        algorithms: 88,
        dataStructures: 82,
        codeQuality: 90,
        communication: 80
      },
      questionDetails: [
        {
          id: 1,
          question: 'Merge Intervals - Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
          timeSpent: '18 min',
          candidateAnswer: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
          score: 90,
          status: 'Correct'
        },
        {
          id: 2,
          question: 'What is the time complexity of your solution?',
          timeSpent: '2 min',
          candidateAnswer: 'O(n log n) due to sorting, then O(n) for merging intervals. Overall O(n log n).',
          score: 95,
          status: 'Correct'
        },
        {
          id: 3,
          question: 'How would you handle edge cases like empty array or single interval?',
          timeSpent: '5 min',
          candidateAnswer: 'Added early return for empty array. Single interval case is handled naturally by the algorithm.',
          score: 75,
          status: 'Partial'
        }
      ]
    },
    {
      _id: 'prev-002',
      title: 'Full Stack System Design',
      candidateName: 'Michael Chen',
      candidateEmail: 'm.chen@example.com',
      role: 'Full Stack Developer',
      completedDate: '2024-01-14',
      duration: '48 min',
      roomId: 'room-def456',
      sessionId: 'sess_1q2w3e',
      problemTitle: 'LRU Cache',
      overallScore: 92,
      status: 'Completed',
      questionsAsked: 2,
      totalQuestions: 3,
      feedback: {
        strengths: ['Excellent system design knowledge', 'Efficient implementation', 'Clear explanations'],
        improvements: ['Add more unit tests', 'Document edge cases'],
        rating: 4.6
      },
      technicalSkills: {
        algorithms: 95,
        dataStructures: 90,
        codeQuality: 88,
        communication: 95
      },
      questionDetails: [
        {
          id: 1,
          question: 'Implement an LRU (Least Recently Used) Cache with get and put operations.',
          timeSpent: '25 min',
          candidateAnswer: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
          score: 98,
          status: 'Excellent'
        },
        {
          id: 2,
          question: 'Explain the time complexity of both operations.',
          timeSpent: '3 min',
          candidateAnswer: 'Both get and put operations are O(1) on average due to Map data structure properties.',
          score: 95,
          status: 'Correct'
        }
      ]
    },
    {
      _id: 'prev-003',
      title: 'Data Structures Round',
      candidateName: 'Emily Rodriguez',
      candidateEmail: 'e.rodriguez@example.com',
      role: 'Software Engineer',
      completedDate: '2024-01-13',
      duration: '45 min',
      roomId: 'room-ghi789',
      sessionId: 'sess_4r5t6u',
      problemTitle: 'Binary Tree Level Order Traversal',
      overallScore: 78,
      status: 'Completed',
      questionsAsked: 3,
      totalQuestions: 3,
      feedback: {
        strengths: ['Good understanding of tree traversal', 'Clean code style'],
        improvements: ['Practice more with recursion', 'Improve time complexity analysis'],
        rating: 3.9
      },
      technicalSkills: {
        algorithms: 75,
        dataStructures: 80,
        codeQuality: 85,
        communication: 72
      },
      questionDetails: [
        {
          id: 1,
          question: 'Implement level order traversal for a binary tree.',
          timeSpent: '20 min',
          candidateAnswer: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          score: 85,
          status: 'Correct'
        },
        {
          id: 2,
          question: 'What is the space complexity?',
          timeSpent: '4 min',
          candidateAnswer: 'O(n) in worst case when tree is completely unbalanced.',
          score: 70,
          status: 'Partial'
        },
        {
          id: 3,
          question: 'Can you implement this recursively?',
          timeSpent: '15 min',
          candidateAnswer: 'Struggled with recursive implementation, took longer than expected.',
          score: 65,
          status: 'Needs Improvement'
        }
      ]
    },
    {
      _id: 'prev-004',
      title: 'Dynamic Programming Challenge',
      candidateName: 'David Kim',
      candidateEmail: 'd.kim@example.com',
      role: 'Backend Engineer',
      completedDate: '2024-01-12',
      duration: '55 min',
      roomId: 'room-jkl012',
      sessionId: 'sess_7i8o9p',
      problemTitle: 'House Robber',
      overallScore: 88,
      status: 'Completed',
      questionsAsked: 2,
      totalQuestions: 3,
      feedback: {
        strengths: ['Strong DP fundamentals', 'Optimal solutions', 'Good time management'],
        improvements: ['Could improve code readability', 'Add more comments'],
        rating: 4.4
      },
      technicalSkills: {
        algorithms: 90,
        dataStructures: 85,
        codeQuality: 82,
        communication: 88
      },
      questionDetails: [
        {
          id: 1,
          question: 'Solve House Robber problem using dynamic programming.',
          timeSpent: '30 min',
          candidateAnswer: `function rob(nums) {
  if (!nums.length) return 0;
  let prev1 = 0, prev2 = 0;
  for (const num of nums) {
    const temp = prev1;
    prev1 = Math.max(prev2 + num, prev1);
    prev2 = temp;
  }
  return prev1;
}`,
          score: 92,
          status: 'Excellent'
        },
        {
          id: 2,
          question: 'Explain the recurrence relation.',
          timeSpent: '5 min',
          candidateAnswer: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). At each house, we either skip it or rob it.',
          score: 90,
          status: 'Correct'
        }
      ]
    }
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateRole, setCandidateRole] = useState('Full Stack Developer');
  const [interviewTitle, setInterviewTitle] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('Two Sum');
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPreviousInterview, setSelectedPreviousInterview] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fixed panel layout state (non-resizable)
  const [panelLayouts, setPanelLayouts] = useState({
    stats: { width: '100%', height: 'auto' },
    sessionAnalytics: { width: '100%', height: 'auto' },
    activeRooms: { width: '100%', height: 'auto' },
    previousReports: { width: '100%', height: 'auto' },
    assessmentBank: { width: '100%', height: 'auto' },
    quickActions: { width: '100%', height: 'auto' },
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get('/interviews/my');
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setInterviews(res.data.data);
      }
    } catch (e) {
      console.warn('Using initial local active candidate rooms set.');
    }
  };

  const handleSelectProblemForSchedule = (problemTitle) => {
    if (selectedProblems.includes(problemTitle)) {
      setSelectedProblems(selectedProblems.filter(p => p !== problemTitle));
    } else {
      setSelectedProblems([...selectedProblems, problemTitle]);
    }
    setSelectedProblem(problemTitle);
    if (!interviewTitle && selectedProblems.length === 0) {
      setInterviewTitle(`${problemTitle} Technical Round`);
    } else if (selectedProblems.length > 0) {
      setInterviewTitle(`Multi-Problem Technical Round`);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const problemsToUse = selectedProblems.length > 0 ? selectedProblems : [selectedProblem];
      const payload = {
        title: interviewTitle || (selectedProblems.length > 0 ? 'Multi-Problem Technical Round' : `${selectedProblem} Interview`),
        type: 'one-to-one',
        candidateName: candidateName || candidateEmail.split('@')[0],
        candidateEmail,
        role: candidateRole,
        problemTitle: selectedProblems.length > 0 ? selectedProblems.join(', ') : selectedProblem,
        problems: problemsToUse,
        scheduledAt: scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
        durationMinutes: parseInt(durationMinutes, 10) || 45,
      };

      const res = await API.post('/interviews', payload);
      if (res.data.success && res.data.data) {
        const newInterview = res.data.data;
        setInterviews((prev) => [newInterview, ...prev]);
        setToastMessage(`Interview "${newInterview.title}" scheduled successfully! Room ID: ${newInterview.roomId}`);
      } else {
        throw new Error('API schedule response invalid');
      }
    } catch (err) {
      const mockRoomId = `room-${Math.random().toString(36).substring(2, 9)}`;
      const problemsToUse = selectedProblems.length > 0 ? selectedProblems : [selectedProblem];
      const fallbackInterview = {
        _id: 'int_' + Date.now(),
        title: interviewTitle || (selectedProblems.length > 0 ? 'Multi-Problem Technical Round' : `${selectedProblem} Interview`),
        candidateName: candidateName || candidateEmail.split('@')[0] || 'Candidate',
        candidateEmail: candidateEmail || 'candidate@example.com',
        role: candidateRole || 'Software Engineer',
        time: scheduledDate ? new Date(scheduledDate).toLocaleString() : 'Scheduled Today',
        roomId: mockRoomId,
        status: 'Scheduled',
        problemTitle: selectedProblems.length > 0 ? selectedProblems.join(', ') : selectedProblem,
        problems: problemsToUse,
      };
      setInterviews((prev) => [fallbackInterview, ...prev]);
      setToastMessage(`Interview scheduled! Room Link: /live-room/${mockRoomId}`);
    } finally {
      setIsSubmitting(false);
      setShowScheduleModal(false);
      // Reset form
      setInterviewTitle('');
      setCandidateName('');
      setCandidateEmail('');
      setSelectedProblems([]);
      setTimeout(() => setToastMessage(''), 6000);
    }
  };

  const copyRoomLink = (roomId) => {
    const fullUrl = `${window.location.origin}/live-room/${roomId}`;
    navigator.clipboard.writeText(fullUrl);
    setToastMessage(`Room link copied to clipboard: /live-room/${roomId}`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Expanded problem bank with categories and difficulties
  const problemBank = [
    { id: 1, title: 'Two Sum', category: 'Arrays', difficulty: 'Easy', timeEstimate: '15 min', companies: ['Google', 'Amazon', 'Meta'] },
    { id: 2, title: 'Valid Parentheses', category: 'Strings', difficulty: 'Easy', timeEstimate: '10 min', companies: ['Microsoft', 'Apple'] },
    { id: 3, title: 'Longest Substring Without Repeating Characters', category: 'Strings', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Google', 'Netflix'] },
    { id: 4, title: 'Merge Intervals', category: 'Arrays', difficulty: 'Medium', timeEstimate: '25 min', companies: ['Amazon', 'Uber'] },
    { id: 5, title: 'Reverse Linked List', category: 'Linked Lists', difficulty: 'Easy', timeEstimate: '15 min', companies: ['Meta', 'Twitter'] },
    { id: 6, title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Google', 'Microsoft'] },
    { id: 7, title: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'Easy', timeEstimate: '10 min', companies: ['Amazon', 'Apple'] },
    { id: 8, title: 'Maximum Subarray', category: 'Arrays', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Meta', 'Netflix'] },
    { id: 9, title: 'Valid Anagram', category: 'Strings', difficulty: 'Easy', timeEstimate: '10 min', companies: ['Microsoft', 'Uber'] },
    { id: 10, title: 'Detect Cycle in Linked List', category: 'Linked Lists', difficulty: 'Medium', timeEstimate: '15 min', companies: ['Google', 'Amazon'] },
    { id: 11, title: 'Binary Tree Inorder Traversal', category: 'Trees', difficulty: 'Easy', timeEstimate: '15 min', companies: ['Meta', 'Apple'] },
    { id: 12, title: 'House Robber', category: 'Dynamic Programming', difficulty: 'Medium', timeEstimate: '25 min', companies: ['Netflix', 'Uber'] },
    { id: 13, title: 'LRU Cache', category: 'Design', difficulty: 'Medium', timeEstimate: '30 min', companies: ['Google', 'Amazon', 'Meta'] },
    { id: 14, title: 'Word Search', category: 'Backtracking', difficulty: 'Medium', timeEstimate: '25 min', companies: ['Microsoft', 'Apple'] },
    { id: 15, title: 'Graph Valid Tree', category: 'Graphs', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Uber', 'Twitter'] },
    { id: 16, title: 'Kth Largest Element in an Array', category: 'Heaps', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Google', 'Amazon'] },
    { id: 17, title: 'Top K Frequent Elements', category: 'Heaps', difficulty: 'Medium', timeEstimate: '25 min', companies: ['Meta', 'Netflix'] },
    { id: 18, title: 'Merge K Sorted Lists', category: 'Heaps', difficulty: 'Hard', timeEstimate: '35 min', companies: ['Google', 'Amazon', 'Meta'] },
    { id: 19, title: 'Group Anagrams', category: 'Hash Maps', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Amazon', 'Microsoft'] },
    { id: 20, title: 'Longest Consecutive Sequence', category: 'Hash Maps', difficulty: 'Medium', timeEstimate: '20 min', companies: ['Google', 'Meta'] },
    { id: 21, title: 'Minimum Window Substring', category: 'Hash Maps', difficulty: 'Hard', timeEstimate: '30 min', companies: ['Amazon', 'Netflix', 'Google'] },
    { id: 22, title: 'Implement Stack using Queues', category: 'Stacks/Queues', difficulty: 'Easy', timeEstimate: '15 min', companies: ['Microsoft', 'Apple'] },
    { id: 23, title: 'Sliding Window Maximum', category: 'Stacks/Queues', difficulty: 'Hard', timeEstimate: '30 min', companies: ['Google', 'Amazon', 'Meta'] },
    { id: 24, title: 'Binary Tree Maximum Path Sum', category: 'Trees', difficulty: 'Hard', timeEstimate: '35 min', companies: ['Google', 'Meta', 'Amazon'] },
    { id: 25, title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', timeEstimate: '25 min', companies: ['Google', 'Meta', 'Amazon'] },
  ];

  const categories = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Design', 'Backtracking', 'Graphs', 'Heaps', 'Hash Maps', 'Stacks/Queues'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter problems based on search, category, and difficulty
  const filteredProblems = problemBank.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewReport = (interview) => {
    setSelectedPreviousInterview(interview);
    setShowReportModal(true);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  // Fixed Panel Component (non-draggable, non-resizable)
  const DraggablePanel = ({ panelId, title, icon: Icon, children, className = '' }) => {
    const layout = panelLayouts[panelId];

    return (
      <div
        id={`panel-${panelId}`}
        className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md ${className}`}
        style={{
          width: layout.width,
          height: layout.height,
        }}
      >
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl flex items-center px-4 py-3 border-b border-gray-200">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700 ml-2">{title}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  };


  return (
    <div className="w-full m-0 px-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold">
            <Video className="w-3.5 h-3.5" /> Technical Evaluator Workspace
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900">
            Interviewer Hub — <span className="text-indigo-600">{user?.name || 'Sarah Chen'}</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Manage live 1-on-1 coding sessions, grade candidates in real time, and view AI evaluations.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Schedule New Interview
        </button>
      </div>

      {/* Stats Overview */}
      <DraggablePanel panelId="stats" title="Statistics Overview" icon={BarChart3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Interviews', value: interviews.length + previousInterviews.length, icon: Video, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
            { label: 'Active Sessions', value: interviews.filter(i => i.status === 'Live').length, icon: Sparkles, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
            { label: 'Completed Sessions', value: previousInterviews.length, icon: CheckCircle2, color: 'text-purple-600', bgColor: 'bg-purple-100' },
            { label: 'Avg. Rating', value: '4.8/5', icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-100' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-600 font-medium block">{stat.label}</span>
                <span className="text-2xl font-bold text-gray-900 mt-1 block">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>
      </DraggablePanel>

      {/* Detailed Session Statistics */}
      <DraggablePanel panelId="sessionAnalytics" title="Session Analytics" icon={BarChart3}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Sessions', value: interviews.length, icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
            { label: 'Questions Asked', value: Math.floor(interviews.length * 2.3), icon: Code2, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { label: 'Total Questions', value: problemBank.length, icon: BookOpen, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
            { label: 'Avg. Duration', value: '42 min', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
            { label: 'Success Rate', value: '78%', icon: TrendingUp, color: 'text-rose-600', bgColor: 'bg-rose-50' },
            { label: 'Candidates', value: interviews.length, icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-lg font-bold text-gray-900 block">{stat.value}</span>
              <span className="text-[10px] text-gray-500 font-medium block">{stat.label}</span>
            </div>
          ))}
        </div>
      </DraggablePanel>

      {/* Live & Upcoming Interviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DraggablePanel panelId="activeRooms" title="Active Candidate Rooms" icon={Calendar}>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-indigo-600 font-bold">
                {interviews.length} Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {interviews.map((item, idx) => {
                const roomId = item.roomId || item.room || `demo-${101 + idx}`;
                const statusStr = item.status || (idx === 0 ? 'Live' : 'Scheduled');
                const candidateDisplayName = item.candidateName || item.candidate || 'Candidate';
                const candidateRoleName = item.role || 'Software Engineer';
                const timeDisplay = item.time || item.scheduledAt ? (item.time || new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : 'Scheduled';
                const sessionId = item.sessionId || `sess_${Math.random().toString(36).substr(2, 9)}`;
                const questionsAsked = item.questionsAsked || Math.floor(Math.random() * 3) + 1;
                const totalQuestions = item.totalQuestions || 3;
                const isCompleted = statusStr.toLowerCase() === 'completed' || statusStr.toLowerCase() === 'finished';

                return (
                  <div key={item._id || idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          statusStr.toLowerCase() === 'live' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : isCompleted ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {statusStr}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{timeDisplay}</span>
                        {item.problemTitle && (
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                            {item.problemTitle}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          Session: {sessionId}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600">
                        Candidate: <strong className="text-gray-800">{candidateDisplayName}</strong> ({candidateRoleName})
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-purple-500" />
                          <span>{questionsAsked}/{totalQuestions} Questions</span>
                        </div>
                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Duration: {item.duration || '45 min'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyRoomLink(roomId)}
                        title="Copy Room Link"
                        className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium border border-gray-300 flex items-center gap-1.5 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" /> Link
                      </button>

                      {isCompleted ? (
                        <button
                          disabled
                          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gray-300 text-gray-500 font-bold text-xs shadow-md cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-4 h-4" /> View Report
                        </button>
                      ) : (
                        <Link
                          to={`/live-room/${roomId}`}
                          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                        >
                          <Video className="w-4 h-4" /> Enter Room
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </DraggablePanel>

          {/* Previous Interviews / Reports Section */}
          <DraggablePanel panelId="previousReports" title="Previous Interview Reports" icon={Award}>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-purple-600 font-bold">
                {previousInterviews.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {previousInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer"
                  onClick={() => handleViewReport(interview)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-600`}>
                          {interview.status}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{interview.completedDate}</span>
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          Session: {interview.sessionId}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{interview.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Candidate: <strong className="text-gray-800">{interview.candidateName}</strong> ({interview.role})
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-purple-500" />
                          <span>{interview.problemTitle}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{interview.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{interview.questionsAsked}/{interview.totalQuestions} Questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getScoreColor(interview.overallScore)}`}>
                        {interview.overallScore}%
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{interview.feedback.rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DraggablePanel>
        </div>

        {/* Question Bank Quick Access */}
        <div className="lg:col-span-4">
          <DraggablePanel panelId="assessmentBank" title="Assessment Bank" icon={Code2}>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                {filteredProblems.length} Problems
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <div className="flex gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              Select multiple problems from different categories:
            </p>

            {/* Selected Problems Summary */}
            {selectedProblems.length > 0 && (
              <div className="mb-3 p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700">{selectedProblems.length} problem(s) selected</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProblems([])}
                      className="px-2 py-1 rounded-lg bg-white border border-indigo-300 text-indigo-600 text-[10px] font-bold hover:bg-indigo-100 transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-all"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedProblems.map((p, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-indigo-300 text-[9px] text-indigo-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Problem List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
              {filteredProblems.map((problem) => {
                const isSelected = selectedProblems.includes(problem.title);
                return (
                  <div
                    key={problem.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-indigo-50 border-indigo-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleSelectProblemForSchedule(problem.title)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <h4 className={`text-xs font-bold transition-colors truncate ${
                            isSelected ? 'text-indigo-700' : 'text-gray-900 group-hover:text-indigo-600'
                          }`}>
                            {problem.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 ml-6">
                          <Tag className="w-3 h-3 text-purple-500" />
                          <span className="text-[10px] text-gray-500">{problem.category}</span>
                          <Clock className="w-3 h-3 text-amber-500 ml-2" />
                          <span className="text-[10px] text-gray-500">{problem.timeEstimate}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex-shrink-0 ${
                          isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-indigo-100 border border-indigo-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-gray-400" />
                      <span className="text-[9px] text-gray-400">{problem.companies.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{problemBank.filter(p => p.difficulty === 'Easy').length}</div>
                <div className="text-[10px] text-gray-500">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">{problemBank.filter(p => p.difficulty === 'Medium').length}</div>
                <div className="text-[10px] text-gray-500">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-rose-600">{problemBank.filter(p => p.difficulty === 'Hard').length}</div>
                <div className="text-[10px] text-gray-500">Hard</div>
              </div>
            </div>
          </DraggablePanel>

          {/* Quick Actions Panel */}
          <DraggablePanel panelId="quickActions" title="Quick Actions" icon={Zap}>
            <div className="space-y-2">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Schedule Interview
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all">
                <BookOpen className="w-4 h-4" /> View All Problems
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all">
                <BarChart3 className="w-4 h-4" /> Interview Analytics
              </button>
            </div>
          </DraggablePanel>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Schedule Candidate Interview
                </h3>
                <p className="text-xs text-gray-600">Setup a live 1-on-1 collaborative coding session</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedProblems([]);
                }}
                className="text-gray-400 hover:text-gray-900 text-base font-bold px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Interview Title</label>
                <input
                  type="text"
                  required
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Architecture Round"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Candidate Email</label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    placeholder="Full Stack Engineer"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Selected Problems</label>
                  <div className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs min-h-[42px]">
                    {selectedProblems.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedProblems.map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No problems selected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Problems Detail */}
              {selectedProblems.length > 0 && (
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                  <h4 className="text-xs font-bold text-indigo-700 mb-2">Selected Problems ({selectedProblems.length})</h4>
                  <div className="space-y-1">
                    {selectedProblems.map((p, idx) => {
                      const problem = problemBank.find(pb => pb.title === p);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-indigo-100">
                          <div>
                            <span className="text-[10px] font-bold text-gray-900">{p}</span>
                            {problem && (
                              <span className="text-[9px] text-gray-500 ml-2">({problem.difficulty} - {problem.category})</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectProblemForSchedule(p)}
                            className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Duration (Minutes)</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedProblems([]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-semibold text-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-extrabold text-white shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Scheduling...' : 'Create & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {showReportModal && selectedPreviousInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" /> Interview Report
                </h3>
                <p className="text-xs text-gray-600">Detailed evaluation and feedback</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-900 text-base font-bold px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Report Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900 mb-1">{selectedPreviousInterview.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Candidate: <strong className="text-gray-800">{selectedPreviousInterview.candidateName}</strong> ({selectedPreviousInterview.role})
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-mono">{selectedPreviousInterview.completedDate}</span>
                    <span>•</span>
                    <span>{selectedPreviousInterview.duration}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedPreviousInterview.sessionId}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-2xl font-bold ${getScoreColor(selectedPreviousInterview.overallScore)}`}>
                  {selectedPreviousInterview.overallScore}%
                </div>
              </div>
            </div>

            {/* Technical Skills Breakdown */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Technical Skills Assessment
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(selectedPreviousInterview.technicalSkills).map(([skill, score]) => (
                  <div key={skill} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-medium capitalize mb-1">{skill}</div>
                    <div className="text-xl font-bold text-gray-900">{score}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${score >= 90 ? 'bg-emerald-500' : score >= 80 ? 'bg-blue-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Details */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-600" /> Problem Details
              </h5>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Problem</span>
                  <span className="text-xs font-bold text-gray-900">{selectedPreviousInterview.problemTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Questions Completed</span>
                  <span className="text-xs font-bold text-gray-900">{selectedPreviousInterview.questionsAsked}/{selectedPreviousInterview.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Overall Rating</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-bold text-gray-900">{selectedPreviousInterview.feedback.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> Feedback Summary
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <h6 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Strengths
                  </h6>
                  <ul className="space-y-1">
                    {selectedPreviousInterview.feedback.strengths.map((strength, idx) => (
                      <li key={idx} className="text-xs text-emerald-800 flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h6 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" /> Areas for Improvement
                  </h6>
                  <ul className="space-y-1">
                    {selectedPreviousInterview.feedback.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-xs text-amber-800 flex items-start gap-1">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Time Spent Per Question Chart */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Time Analysis Per Question
              </h5>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="space-y-3">
                  {selectedPreviousInterview.questionDetails.map((q, idx) => (
                    <div key={q.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">Q{idx + 1}: {q.question.substring(0, 50)}...</span>
                        <span className="font-mono text-indigo-600 font-bold">{q.timeSpent}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (parseInt(q.timeSpent) / 30) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Performance Chart */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" /> Question Performance Score
              </h5>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-end justify-between gap-2 h-32">
                  {selectedPreviousInterview.questionDetails.map((q, idx) => (
                    <div key={q.id} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: `${q.score}%` }}>
                        <div
                          className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${q.score >= 90 ? 'bg-emerald-500' : q.score >= 80 ? 'bg-blue-500' : q.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ height: '100%' }}
                        ></div>
                      </div>
                      <div className="text-[10px] font-bold text-gray-700 mt-1">Q{idx + 1}</div>
                      <div className="text-[10px] font-mono text-gray-500">{q.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Questions and Answers */}
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Detailed Questions & Answers
              </h5>
              <div className="space-y-4">
                {selectedPreviousInterview.questionDetails.map((q, idx) => (
                  <div key={q.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700">
                            Question {idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            q.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                            q.status === 'Correct' ? 'bg-blue-100 text-blue-700' :
                            q.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {q.status}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {q.timeSpent}
                          </span>
                        </div>
                        <p className="text-xs text-gray-800 font-medium mb-2">{q.question}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        q.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                        q.score >= 80 ? 'bg-blue-100 text-blue-700' :
                        q.score >= 70 ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {q.score}%
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-[10px] text-gray-500 font-medium mb-1 flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Candidate Answer:
                      </div>
                      <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap overflow-x-auto">
                        {q.candidateAnswer}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-semibold text-gray-700 transition-all"
              >
                Close
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-extrabold text-white shadow-md transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

