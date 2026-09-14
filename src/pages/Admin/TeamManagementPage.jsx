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
    password: '',
  });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

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

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCreating(true);

    try {
      await createMemberAccount(formData.email, formData.password, formData.name, teamId);
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);

      // Reload members
      const teamMembers = await getTeamMembers(teamId);
      setMembers(teamMembers);
    } catch (err) {
      setError(err.message || 'Failed to create member account');
    } finally {
      setCreating(false);
    }
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
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="create-form-section">
          <h3>Create New Member Account</h3>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleCreateMember}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Member name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set password"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Member'}
            </button>
          </form>
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
