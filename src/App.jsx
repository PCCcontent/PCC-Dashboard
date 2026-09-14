import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalendarNew from './pages/CalendarNew';
import Planning from './pages/Planning';
import AnalyticsNew from './pages/AnalyticsNew';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Adrian');

  useEffect(() => {
    // Simulate user check (will connect to Firebase Auth later)
    setUser({ name: adminName, role: 'admin' });
    setLoading(false);
  }, [adminName]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <h2>🎬 PCC Dashboard</h2>
          </div>
          <ul className="nav-menu">
            <li><Link to="/">📅 Calendar</Link></li>
            <li><Link to="/planning">📋 Planning</Link></li>
            <li><Link to="/analytics">📊 Analytics</Link></li>
            <li><Link to="/settings">⚙️ Settings</Link></li>
          </ul>
          <div className="user-info">
            <p>{user.name}</p>
            <span>{user.role}</span>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CalendarNew />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/analytics" element={<AnalyticsNew />} />
            <Route path="/settings" element={<Settings setAdminName={setAdminName} adminName={adminName} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
