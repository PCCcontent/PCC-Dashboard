import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTeamMembers, createMemberAccount } from '../../services/auth.service';
import '../../styles/TeamManagement.css';

function TeamManagementPage() {
  const { userProfile, userRole, teamId } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userRole !== 'admin') return;

    const loadMembers = async () => {
      try {
        const teamMembers = await getTeamMembers(teamId);
        setMembers(teamMembers);
      } catch (err) {
        console.error('Error loading members:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [teamId, userRole]);

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    setCreating(true);
    const generatedPassword = generatePassword();

    try {
      await createMemberAccount(formData.email, generatedPassword, formData.name, teamId);
      setCreatedPassword(generatedPassword);
      setShowPassword(true);
      setFormData({ name: '', email: '' });

      // Reload members after a short delay
      setTimeout(async () => {
        const teamMembers = await getTeamMembers(teamId);
        setMembers(teamMembers);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create member account');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(createdPassword);
    alert('Password copied to clipboard!');
  };

  if (userRole !== 'admin') {
    return <div className="access-denied">Only admins can access this page</div>;
  }

  return (
    <div className="team-management-container">
      <div className="team-header">
        <h1>Team Management</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setShowPassword(false);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="create-form-section">
          <h3>Create New Member Account</h3>
          {error && <div className="error-message">{error}</div>}

          {showPassword ? (
            <div className="password-display">
              <p><strong>✓ Account created successfully!</strong></p>
              <p>Share this temporary password with the team member:</p>
              <div className="password-box">
                <code>{createdPassword}</code>
                <button type="button" className="btn-secondary" onClick={handleCopyPassword}>
                  📋 Copy
                </button>
              </div>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                They can change their password after logging in.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setShowPassword(false);
                  setShowForm(false);
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateMember}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Team member name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="member@clinic.com"
                />
              </div>

              <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                A secure password will be generated automatically.
              </p>

              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create Member'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="members-section">
        <h2>Team Members ({members.length})</h2>

        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p className="empty-state">No team members yet</p>
        ) : (
          <div className="members-table">
            <div className="table-header">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
            </div>
            {members.map(member => (
              <div key={member.id} className="table-row">
                <div>{member.name}</div>
                <div>{member.email}</div>
                <div><span className="role-badge">{member.role}</span></div>
                <div><span className="status-badge" data-status={member.status}>{member.status}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamManagementPage;
