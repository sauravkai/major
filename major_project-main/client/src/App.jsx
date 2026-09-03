import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';

import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { PracticeCodingPage } from './pages/candidate/PracticeCodingPage';
import { AIInterviewPage } from './pages/candidate/AIInterviewPage';
import { CandidateWelcomePage } from './pages/candidate/CandidateWelcomePage';

import { InterviewerDashboard } from './pages/interviewer/InterviewerDashboard';
import { LiveInterviewRoom } from './pages/interviewer/LiveInterviewRoom';
import { InterviewerWelcomePage } from './pages/interviewer/InterviewerWelcomePage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ResultsReportPage } from './pages/common/ResultsReportPage';
import { ProfilePage } from './pages/common/ProfilePage';

/** Gate a route behind a session, and optionally behind a set of roles. */
function RequireAuth({ roles, children }) {
  const { user, token } = useAuth();

  if (!user || !token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<LandingPage />} />
          <Route path="/pricing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Candidate Portal */}
          <Route path="/candidate/welcome" element={<RequireAuth><CandidateWelcomePage /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><CandidateDashboard /></RequireAuth>} />
          <Route path="/practice" element={<RequireAuth><PracticeCodingPage /></RequireAuth>} />
          <Route path="/ai-interview/practice" element={<RequireAuth><AIInterviewPage /></RequireAuth>} />

          {/* Interviewer Portal */}
          <Route
            path="/interviewer/welcome"
            element={<RequireAuth roles={['interviewer', 'admin']}><InterviewerWelcomePage /></RequireAuth>}
          />
          <Route
            path="/interviewer/dashboard"
            element={<RequireAuth roles={['interviewer', 'admin']}><InterviewerDashboard /></RequireAuth>}
          />
          <Route path="/live-room/:roomId" element={<RequireAuth><LiveInterviewRoom /></RequireAuth>} />

          {/* Admin Portal */}
          <Route path="/admin/dashboard" element={<RequireAuth roles={['admin']}><AdminDashboard /></RequireAuth>} />

          {/* Evaluation Reports */}
          <Route path="/results/:reportId" element={<RequireAuth><ResultsReportPage /></RequireAuth>} />

          {/* Profile */}
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <AppContent />
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
