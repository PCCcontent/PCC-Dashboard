import React, { useState } from 'react';
import '../styles/Settings.css';

function Settings({ setAdminName, adminName }) {
  const [formData, setFormData] = useState({
    adminName: adminName,
    clinicName: 'PCC Clinic',
    email: 'adrian@pcc.com'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setAdminName(formData.adminName);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container">
      <h1>⚙️ Settings</h1>

      {saved && <div className="success-message">✅ Settings saved successfully!</div>}

      {/* Admin Settings */}
      <div className="settings-card">
        <h2>👤 Admin Profile</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>Admin Name</label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Your name"
            />
            <small>This is how you appear to your team</small>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
            <small>Used for login and notifications</small>
          </div>

          <div className="form-group">
            <label>Clinic Name</label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              placeholder="Clinic name"
            />
            <small>Your clinic/business name</small>
          </div>

          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="settings-card">
        <h2>🎨 Preferences</h2>
        <div className="settings-form">
          <div className="form-group checkbox">
            <input type="checkbox" id="notifications" defaultChecked />
            <label htmlFor="notifications">Enable email notifications</label>
            <small>Get notified when team members upload content</small>
          </div>

          <div className="form-group checkbox">
            <input type="checkbox" id="dark-mode" />
            <label htmlFor="dark-mode">Dark mode</label>
            <small>Switch to dark theme (coming soon)</small>
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select>
              <option>Asia/Manila (UTC +8)</option>
              <option>Asia/Bangkok (UTC +7)</option>
              <option>Asia/Singapore (UTC +8)</option>
            </select>
            <small>Used for scheduling posts</small>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="settings-card">
        <h2>👥 Team Management (Coming Soon)</h2>
        <p className="coming-soon">
          Add team members, manage permissions, and set access levels coming in Phase 3
        </p>
      </div>

      {/* Firebase Setup */}
      <div className="settings-card info-card">
        <h2>ℹ️ Database Setup (Coming Soon)</h2>
        <p>
          Firebase integration will enable:
        </p>
        <ul>
          <li>✅ Permanent data storage</li>
          <li>✅ Real-time sync across team</li>
          <li>✅ Team authentication</li>
          <li>✅ Data backups</li>
        </ul>
      </div>

      {/* About */}
      <div className="settings-card">
        <h2>ℹ️ About</h2>
        <div className="about-info">
          <p><strong>System:</strong> PCC Clinic Social Media Dashboard</p>
          <p><strong>Version:</strong> 2.0 (Phase 2)</p>
          <p><strong>Status:</strong> In Development</p>
          <p><strong>Next Update:</strong> Team login & Firebase (Phase 3)</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
