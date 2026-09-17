import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import '../styles/Planning.css';

function Planning() {
  const { userProfile, teamId } = useAuth();
  const [monthlyStrategy, setMonthlyStrategy] = useState({
    month: 'October',
    year: 2026,
    theme: 'Health Awareness Month',
    goals: 'Reach 5000 people, 3% engagement rate, 200 new followers',
    keyDates: 'Oct 5: World Mental Health Day, Oct 10: Launch campaign'
  });

  const [ideas, setIdeas] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStrategy, setEditingStrategy] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [error, setError] = useState('');

  const PLATFORMS = ['Instagram', 'Facebook'];
  const CONTENT_TYPES = ['1-min Video', '10-30sec Video', 'Static Post'];

  const [newIdea, setNewIdea] = useState({
    title: '',
    category: 'Video Idea',
    suggestedBy: '',
    status: 'Idea',
    targetMonth: 'October',
    platform: 'Instagram',
    contentType: '1-min Video',
    assignedTo: ''
  });

  // Load team members and ideas
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load team members
        const q = query(collection(db, 'team_members'), where('teamId', '==', teamId || 'default-team'));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeamMembers(members);

        // Load ideas
        const ideasQ = query(collection(db, 'ideas'), where('teamId', '==', teamId || 'default-team'));
        const ideasSnapshot = await getDocs(ideasQ);
        const ideasList = ideasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIdeas(ideasList);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teamId]);

  const handleSaveStrategy = () => {
    setEditingStrategy(false);
    // Strategy is stored locally for now
  };

  const handleAddIdea = async () => {
    setError('');
    if (!newIdea.title || !newIdea.suggestedBy) {
      setError('Please fill in title and suggested by');
      return;
    }

    try {
      await addDoc(collection(db, 'ideas'), {
        title: newIdea.title,
        category: newIdea.category,
        suggestedBy: newIdea.suggestedBy,
        status: newIdea.status,
        targetMonth: newIdea.targetMonth,
        platform: newIdea.platform,
        contentType: newIdea.contentType,
        assignedTo: newIdea.assignedTo,
        teamId: teamId || 'default-team',
        createdAt: new Date(),
      });

      setNewIdea({
        title: '',
        category: 'Video Idea',
        suggestedBy: '',
        status: 'Idea',
        targetMonth: 'October',
        platform: 'Instagram',
        contentType: '1-min Video',
        assignedTo: ''
      });

      // Reload ideas
      const ideasQ = query(collection(db, 'ideas'), where('teamId', '==', teamId || 'default-team'));
      const ideasSnapshot = await getDocs(ideasQ);
      const ideasList = ideasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasList);
    } catch (err) {
      setError('Failed to add idea: ' + err.message);
    }
  };

  const handleEditIdea = (idea) => {
    setNewIdea(idea);
    setEditingIdeaId(idea.id);
  };

  const handleUpdateIdea = async () => {
    setError('');
    if (!newIdea.title || !newIdea.suggestedBy) {
      setError('Please fill in title and suggested by');
      return;
    }

    try {
      await updateDoc(doc(db, 'ideas', editingIdeaId), {
        title: newIdea.title,
        category: newIdea.category,
        suggestedBy: newIdea.suggestedBy,
        status: newIdea.status,
        targetMonth: newIdea.targetMonth,
        platform: newIdea.platform,
        contentType: newIdea.contentType,
        assignedTo: newIdea.assignedTo,
      });

      setEditingIdeaId(null);
      setNewIdea({
        title: '',
        category: 'Video Idea',
        suggestedBy: '',
        status: 'Idea',
        targetMonth: 'October',
        platform: 'Instagram',
        contentType: '1-min Video',
        assignedTo: ''
      });

      // Reload ideas
      const ideasQ = query(collection(db, 'ideas'), where('teamId', '==', teamId || 'default-team'));
      const ideasSnapshot = await getDocs(ideasQ);
      const ideasList = ideasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasList);
    } catch (err) {
      setError('Failed to update idea: ' + err.message);
    }
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm('Delete this idea?')) {
      try {
        await deleteDoc(doc(db, 'ideas', id));
        setIdeas(ideas.filter(i => i.id !== id));
      } catch (err) {
        setError('Failed to delete idea: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="planning-container"><p>Loading...</p></div>;
  }

  return (
    <div className="planning-container">
      <h1>📋 Planning & Strategy</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Monthly Strategy Section */}
      <div className="strategy-card">
        <h2>📅 Monthly Strategy - {monthlyStrategy.month} {monthlyStrategy.year}</h2>
        {editingStrategy ? (
          <div className="strategy-form">
            <div className="form-group">
              <label>Theme:</label>
              <input
                type="text"
                value={monthlyStrategy.theme}
                onChange={(e) => setMonthlyStrategy({ ...monthlyStrategy, theme: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Goals:</label>
              <textarea
                value={monthlyStrategy.goals}
                onChange={(e) => setMonthlyStrategy({ ...monthlyStrategy, goals: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Key Dates/Events:</label>
              <textarea
                value={monthlyStrategy.keyDates}
                onChange={(e) => setMonthlyStrategy({ ...monthlyStrategy, keyDates: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSaveStrategy}>Save</button>
              <button className="btn-secondary" onClick={() => setEditingStrategy(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="strategy-display">
            <p><strong>Theme:</strong> {monthlyStrategy.theme}</p>
            <p><strong>Goals:</strong> {monthlyStrategy.goals}</p>
            <p><strong>Key Dates:</strong> {monthlyStrategy.keyDates}</p>
            <button className="btn-secondary" onClick={() => setEditingStrategy(true)}>Edit Strategy</button>
          </div>
        )}
      </div>

      {/* Team Availability */}
      <div className="team-card">
        <h2>👥 Team Availability</h2>
        <div className="team-list">
          {teamMembers.map(member => (
            <div key={member.name} className="team-member">
              <p><strong>{member.name}</strong></p>
              <p className="availability">{member.availability}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Ideas Bank */}
      <div className="ideas-card">
        <h2>💡 Content Ideas Bank</h2>

        <div className="idea-form">
          <h3>{editingIdeaId ? 'Edit Idea' : 'Submit New Idea'}</h3>
          <div className="form-grid">
            <input
              type="text"
              value={newIdea.title}
              onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              placeholder="Idea Title"
            />
            <select
              value={newIdea.category}
              onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
            >
              <option>Video Idea</option>
              <option>Static Idea</option>
              <option>Series</option>
            </select>
            <input
              type="text"
              value={newIdea.suggestedBy}
              onChange={(e) => setNewIdea({ ...newIdea, suggestedBy: e.target.value })}
              placeholder="Your Name"
            />
            <select
              value={newIdea.targetMonth}
              onChange={(e) => setNewIdea({ ...newIdea, targetMonth: e.target.value })}
            >
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <select
              value={newIdea.platform}
              onChange={(e) => setNewIdea({ ...newIdea, platform: e.target.value })}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={newIdea.contentType}
              onChange={(e) => setNewIdea({ ...newIdea, contentType: e.target.value })}
            >
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={newIdea.assignedTo}
              onChange={(e) => setNewIdea({ ...newIdea, assignedTo: e.target.value })}
            >
              <option value="">-- Assign to Member --</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <select
              value={newIdea.status}
              onChange={(e) => setNewIdea({ ...newIdea, status: e.target.value })}
            >
              <option>Idea</option>
              <option>Approved</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="form-actions">
            {editingIdeaId ? (
              <>
                <button className="btn-primary" onClick={handleUpdateIdea}>Update Idea</button>
                <button className="btn-secondary" onClick={() => {
                  setEditingIdeaId(null);
                  setNewIdea({
                    title: '',
                    category: 'Video Idea',
                    suggestedBy: '',
                    status: 'Idea',
                    targetMonth: 'October',
                    platform: 'Instagram',
                    contentType: '1-min Video',
                    assignedTo: ''
                  });
                }}>Cancel</button>
              </>
            ) : (
              <button className="btn-primary" onClick={handleAddIdea}>Add Idea</button>
            )}
          </div>
        </div>

        <div className="ideas-list">
          <h3>All Ideas ({ideas.length})</h3>
          {ideas.length === 0 ? (
            <p>No ideas yet. Be the first to suggest one!</p>
          ) : (
            <div className="ideas-cards">
              {ideas.map(idea => {
                const assignedMember = teamMembers.find(m => m.id === idea.assignedTo);
                return (
                  <div key={idea.id} className="idea-card">
                    <div className="idea-header">
                      <h4>{idea.title}</h4>
                      <span className={`status-tag ${idea.status.toLowerCase()}`}>
                        {idea.status}
                      </span>
                    </div>
                    <div className="idea-meta">
                      <span className="badge">{idea.category}</span>
                      <span className="badge">{idea.platform}</span>
                      <span className="badge">{idea.contentType}</span>
                    </div>
                    <p className="idea-details">
                      <strong>By:</strong> {idea.suggestedBy} | <strong>Month:</strong> {idea.targetMonth}
                    </p>
                    {assignedMember && (
                      <p className="idea-assigned">
                        <strong>Assigned to:</strong> {assignedMember.name}
                      </p>
                    )}
                    <div className="idea-actions">
                      <button className="btn-edit" onClick={() => handleEditIdea(idea)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteIdea(idea.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Planning;
