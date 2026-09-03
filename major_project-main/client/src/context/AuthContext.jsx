import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { isGoogleAuthEnabled, requestGoogleCredential } from '../services/googleIdentity';

const AuthContext = createContext();

const readStoredUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const errorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
  }, []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get('/auth/me');
        if (!cancelled && res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // A rejected token means the session is gone; never keep a stale identity around.
        if (!cancelled && err?.response?.status === 401) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  const submitCredentials = async (path, payload, fallbackMessage) => {
    try {
      setLoading(true);
      const res = await API.post(path, payload);
      if (!res.data.success) return { success: false, message: res.data.message || fallbackMessage };
      persistSession(res.data.token, res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: errorMessage(err, fallbackMessage) };
    } finally {
      setLoading(false);
    }
  };

  const login = (email, password) => submitCredentials('/auth/login', { email, password }, 'Login failed');

  const register = (userData) => submitCredentials('/auth/register', userData, 'Registration failed');

  const authenticateWithGoogle = async (role) => {
    try {
      const credential = await requestGoogleCredential();
      return await submitCredentials('/auth/google', { credential, role }, 'Google sign-in failed');
    } catch (err) {
      return { success: false, message: errorMessage(err, 'Google sign-in failed') };
    }
  };

  const loginWithGoogle = () => authenticateWithGoogle();

  const registerWithGoogle = (role = 'candidate') => authenticateWithGoogle(role);

  /** Password-less sample accounts; the server only issues these while DEMO_MODE is on. */
  const loginAsDemoRole = (role = 'candidate') =>
    submitCredentials('/auth/demo', { role }, 'Demo sign-in is disabled on this server');

  const logout = async () => {
    try {
      if (token) await API.post('/auth/logout');
    } catch {
      // The local session is dropped regardless of whether the server call lands.
    }
    clearSession();
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
        setUser,
        isGoogleAuthEnabled,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
