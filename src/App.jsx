import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Planning from './pages/Planning';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate user check (will connect to Firebase later)
    setUser({ name: 'Adrian', role: 'admin' });
    setLoading(false);
  }, []);

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
          </ul>
          <div className="user-info">
            <p>{user.name}</p>
            <span>{user.role}</span>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
