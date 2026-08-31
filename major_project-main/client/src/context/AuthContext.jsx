import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Using local cached user state.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    try {
      setLoading(true);
      // Mock Google OAuth - in production, this would use actual Google OAuth
      const mockGoogleUser = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'candidate',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      };
      
      const res = await API.post('/auth/google', mockGoogleUser);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      // Fallback to mock registration if API fails
      const mockToken = `mock_google_token_${Date.now()}`;
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'candidate',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      };
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      // Mock Google OAuth login - in production, this would use actual Google OAuth
      const mockGoogleUser = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'candidate',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      };
      
      const res = await API.post('/auth/google', mockGoogleUser);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      // Fallback to mock login if API fails
      const mockToken = `mock_google_token_${Date.now()}`;
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'candidate',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      };
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoRole = (role = 'candidate') => {
    const demoUsers = {
      candidate: {
        id: 'c1',
        name: 'demo user',
        email: 'alex.rivera@example.com',
        role: 'candidate',
        title: 'Full Stack Engineer Candidate',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        stats: { interviewsCompleted: 12, problemsSolved: 48, averageScore: 88 },
      },
      interviewer: {
        id: 'i1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.io',
        role: 'interviewer',
        title: 'Principal Software Architect',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        stats: { interviewsCompleted: 85, problemsSolved: 120, averageScore: 92 },
      },
      admin: {
        id: 'a1',
        name: 'Marcus Vance',
        email: 'admin@platform.io',
        role: 'admin',
        title: 'Head of Technical Recruiting',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        stats: { interviewsCompleted: 400, problemsSolved: 350, averageScore: 95 },
      },
    };

    const selected = demoUsers[role] || demoUsers.candidate;
    const mockToken = `mock_jwt_token_${role}_${Date.now()}`;
    setUser(selected);
    setToken(mockToken);
    localStorage.setItem('user', JSON.stringify(selected));
    localStorage.setItem('token', mockToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        registerWithGoogle,
        loginWithGoogle,
        loginAsDemoRole,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
