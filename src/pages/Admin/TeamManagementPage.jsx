import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
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
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (userRole !== 'admin') return;
    loadMembers();
  }, [teamId, userRole]);

  const loadMembers = async () => {
    try {
      const q = query(collection(db, 'team_members'), where('teamId', '==', teamId || 'default-team'));
      const snapshot = await getDocs(q);
      const membersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersList);
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    setCreating(true);

    try {
      // Add member to Firestore
      await addDoc(collection(db, 'team_members'), {
        name: formData.name,
        email: formData.email,
        role: 'member',
        status: 'active',
        teamId: teamId || 'default-team',
        createdAt: new Date(),
      });

      setSuccessMsg(`✓ ${formData.name} added to team!`);
      setFormData({ name: '', email: '' });

      // Reload members
      await loadMembers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add member');
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
          onClick={() => {
            setShowForm(!showForm);
            setError('');
            setSuccessMsg('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="create-form-section">
          <h3>Add Team Member</h3>
          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <form onSubmit={handleCreateMember}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Team member name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@clinic.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Adding...' : 'Add Member'}
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
