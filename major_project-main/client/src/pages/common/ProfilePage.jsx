import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  User,
  Mail,
  Shield,
  Camera,
  Key,
  Save,
  X,
  Check,
  Upload,
  Edit2,
  LogOut,
  AlertCircle,
  Bell,
  Lock,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Sparkles,
  BarChart3,
  Settings,
  UserCog,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [socialLinks, setSocialLinks] = useState(user?.socialLinks || {
    github: '',
    linkedin: '',
    twitter: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    interviewReminders: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Fetch sessions when sessions tab is active
  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await API.get('/sessions');
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      // Set mock data for demo purposes
      setSessions([
        {
          type: 'login',
          ipAddress: '192.168.1.100',
          location: 'San Francisco, CA',
          device: 'Chrome on Windows',
          timestamp: new Date().toISOString(),
          isActive: true,
        },
        {
          type: 'login',
          ipAddress: '192.168.1.105',
          location: 'New York, NY',
          device: 'Safari on iPhone',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isActive: false,
        },
        {
          type: 'logout',
          ipAddress: '192.168.1.100',
          location: 'San Francisco, CA',
          device: 'Chrome on Windows',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isActive: false,
        },
      ]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await API.put('/auth/profile', {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        skills,
        socialLinks,
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setShowSuccess(true);
        setIsEditing(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks({ ...socialLinks, [platform]: value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        setShowSuccess(true);
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingPhoto(true);
      setError('');

      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Image = reader.result;

          try {
            const res = await API.put('/auth/avatar', {
              avatar: base64Image,
            });

            if (res.data.success) {
              setUser(res.data.user);
              localStorage.setItem('user', JSON.stringify(res.data.user));
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload photo');
          } finally {
            setIsUploadingPhoto(false);
          }
        };
        reader.onerror = () => {
          setError('Failed to process image');
          setIsUploadingPhoto(false);
        };
      } catch (err) {
        setError('Failed to process image');
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = user?.stats || {
    interviewsCompleted: 0,
    problemsSolved: 0,
    averageScore: 0,
    totalHours: 0,
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'sessions', label: 'Sessions', icon: Clock },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              Profile Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              Changes saved successfully!
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden sticky top-8">
              {/* Profile Header with Avatar */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={user?.name}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <label className={`absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg ${isUploadingPhoto ? 'cursor-not-allowed opacity-50' : ''}`}>
                      {isUploadingPhoto ? (
                        <div className="w-4 h-4 border-2 border-slate-600 dark:border-slate-300 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                      />
                    </label>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                  <p className="text-indigo-100 text-sm mb-2">{user?.title || 'User'}</p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                      {user?.role || 'Candidate'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Interviews</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.interviewsCompleted}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Score</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.averageScore}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Hours</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalHours}</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Problems</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.problemsSolved}</p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-indigo-500" />
                  Account Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{user?.email}</span>
                  </div>
                  {user?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{user.location}</span>
                    </div>
                  )}
                  {user?.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Member since 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabbed Interface */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        Personal Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              value={formData.email}
                              disabled
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              disabled={!isEditing}
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Website
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="url"
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                              disabled={!isEditing}
                              placeholder="https://yourwebsite.com"
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            disabled={!isEditing}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        Skills & Expertise
                      </h3>
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill (e.g., JavaScript, React)"
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        onClick={addSkill}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 group"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {skills.length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          No skills added yet. Add your skills above!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        Social Links
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          <Github className="w-4 h-4 inline mr-2" />
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={socialLinks.github}
                          onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          <Linkedin className="w-4 h-4 inline mr-2" />
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={socialLinks.linkedin}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          <Twitter className="w-4 h-4 inline mr-2" />
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleProfileUpdate}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Social Links
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Login Sessions
                      </h3>
                    </div>

                    {loadingSessions ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No session history available</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sessions.map((session, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${
                              session.isActive
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {session.isActive && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-full">
                                      Current Session
                                    </span>
                                  )}
                                  <span className={`text-sm font-medium ${
                                    session.type === 'login' 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-rose-600 dark:text-rose-400'
                                  }`}>
                                    {session.type === 'login' ? 'Login' : 'Logout'}
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                    <span>{session.location || 'Unknown Location'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Globe className="w-4 h-4" />
                                    <span>{session.ipAddress || 'Unknown IP'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Smartphone className="w-4 h-4" />
                                    <span>{session.device || 'Unknown Device'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(session.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              {session.isActive && (
                                <button className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                                  Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        Security Settings
                      </h3>
                    </div>

                    {/* Password Change */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                      <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-500" />
                        Change Password
                      </h4>

                      {!isChangingPassword ? (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Change Password
                        </button>
                      ) : (
                        <form onSubmit={handlePasswordChange}>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? 'text' : 'password'}
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setError('');
                              }}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  Update Password
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Security Options */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                      <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-500" />
                        Security Options
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                          </div>
                          <button
                            onClick={() => handleSecurityChange('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              securitySettings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Login Alerts</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Get notified of new sign-ins</p>
                          </div>
                          <button
                            onClick={() => handleSecurityChange('loginAlerts', !securitySettings.loginAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              securitySettings.loginAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        Notification Preferences
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive updates via email</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.email ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Push Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive push notifications</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.push ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Interview Reminders</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Get reminded about upcoming interviews</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('interviewReminders')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.interviewReminders ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.interviewReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive weekly performance reports</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('weeklyReport')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.weeklyReport ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Marketing Emails</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive product updates and offers</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('marketingEmails')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.marketingEmails ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
