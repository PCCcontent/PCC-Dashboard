import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

// Main Pages
import PersonalDashboard from './pages/PersonalDashboard';
import CalendarNew from './pages/CalendarNew';
import Planning from './pages/Planning';
import AnalyticsNew from './pages/AnalyticsNew';
import Settings from './pages/Settings';
import TeamManagementPage from './pages/Admin/TeamManagementPage';

import './App.css';

function AppContent() {
  const { currentUser, userProfile, loading, userRole } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Show login/signup if not authenticated
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Show main app if authenticated
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <h2>🎬 PCC Dashboard</h2>
        </div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/calendar">📅 Calendar</Link></li>
          <li><Link to="/planning">📋 Planning</Link></li>
          <li><Link to="/analytics">📈 Analytics</Link></li>
          {userRole === 'admin' && <li><Link to="/admin/team">👥 Team</Link></li>}
          <li><Link to="/settings">⚙️ Settings</Link></li>
        </ul>
        <div className="user-info">
          <p>{userProfile?.name}</p>
          <span>{userProfile?.role}</span>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><PersonalDashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarNew /></ProtectedRoute>} />
          <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsNew /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/team" element={<ProtectedRoute><TeamManagementPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
