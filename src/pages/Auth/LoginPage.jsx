import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Hardcoded admin credentials
    if (email === 'admin@clinic.com' && password === 'admin') {
      localStorage.setItem('currentUser', JSON.stringify({
        uid: 'admin-001',
        email: 'admin@clinic.com',
        name: 'Admin',
        role: 'admin',
      }));
      // Full page reload to update AuthContext
      window.location.href = '/';
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>PCC Dashboard</h1>
        <p className="subtitle">Team Collaboration Platform</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ fontSize: '0.9em', color: '#999' }}>
            Demo: admin@clinic.com / admin
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
