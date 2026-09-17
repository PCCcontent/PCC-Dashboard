import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import '../styles/TeamDashboard.css';

function TeamDashboard() {
  const teamId = 'default-team';
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  // Load team members and tasks
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load team members
      const q = query(collection(db, 'team_members'), where('teamId', '==', teamId));
      const snapshot = await getDocs(q);
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeamMembers(members);

      // Set first member as selected
      if (members.length > 0 && !selectedMemberId) {
        setSelectedMemberId(members[0].id);
      }

      // Load all tasks
      const tasksQ = query(collection(db, 'posts'), where('teamId', '==', teamId));
      const tasksSnapshot = await getDocs(tasksQ);
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Name and email required');
      return;
    }

    try {
      await addDoc(collection(db, 'team_members'), {
        name: formData.name,
        email: formData.email,
        role: 'member',
        status: 'active',
        teamId: teamId,
        createdAt: new Date(),
      });

      setFormData({ name: '', email: '' });
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      setError('Failed to add member: ' + err.message);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Name and email required');
      return;
    }

    try {
      await updateDoc(doc(db, 'team_members', editingMemberId), {
        name: formData.name,
        email: formData.email,
      });

      setFormData({ name: '', email: '' });
      setEditingMemberId(null);
      await loadData();
    } catch (err) {
      setError('Failed to update member: ' + err.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Delete this member?')) {
      try {
        await deleteDoc(doc(db, 'team_members', memberId));
        if (selectedMemberId === memberId) {
          setSelectedMemberId(teamMembers.length > 1 ? teamMembers[0].id : null);
        }
        await loadData();
      } catch (err) {
        setError('Failed to delete member: ' + err.message);
      }
    }
  };

  const handleEditClick = (member) => {
    setFormData({ name: member.name, email: member.email });
    setEditingMemberId(member.id);
    setShowAddForm(false);
  };

  const getTasksForMember = (memberId) => {
    return tasks.filter(task => task.assignedTo === memberId);
  };

  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);
  const selectedMemberTasks = selectedMember ? getTasksForMember(selectedMemberId) : [];

  if (loading) {
    return <div className="team-dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="team-dashboard-container">
      <div className="dashboard-header">
        <h1>👥 Team Dashboard</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingMemberId(null);
            setFormData({ name: '', email: '' });
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="form-card">
          <h3>Add New Member</h3>
          <form onSubmit={handleAddMember}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Add Member</button>
          </form>
        </div>
      )}

      {editingMemberId && (
        <div className="form-card">
          <h3>Edit Member</h3>
          <form onSubmit={handleEditMember}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Update</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingMemberId(null);
                setFormData({ name: '', email: '' });
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {teamMembers.map(member => (
            <button
              key={member.id}
              className={`tab ${selectedMemberId === member.id ? 'active' : ''}`}
              onClick={() => setSelectedMemberId(member.id)}
            >
              {member.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedMember && (
        <div className="tab-content">
          <div className="member-info">
            <h2>{selectedMember.name}</h2>
            <p>{selectedMember.email}</p>
            <div className="member-actions">
              <button
                className="btn-edit"
                onClick={() => handleEditClick(selectedMember)}
              >
                ✎ Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteMember(selectedMember.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="tasks-section">
            <h3>Assigned Tasks ({selectedMemberTasks.length})</h3>
            {selectedMemberTasks.length === 0 ? (
              <p className="empty-state">No tasks assigned yet</p>
            ) : (
              <div className="tasks-list">
                {selectedMemberTasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h4>{task.caption?.substring(0, 50) || 'Untitled'}...</h4>
                      <span className="status-badge" data-status={task.status}>{task.status}</span>
                    </div>
                    <div className="task-meta">
                      <span>{task.platform} • {task.contentType}</span>
                      <span>{new Date(task.scheduledDate?.toDate?.() || task.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {teamMembers.length === 0 && (
        <div className="empty-state">
          <p>No team members yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

export default TeamDashboard;
