import React, { useState } from 'react';
import '../styles/Planning.css';

function Planning() {
  const [monthlyStrategy, setMonthlyStrategy] = useState({
    month: 'October',
    year: 2026,
    theme: 'Health Awareness Month',
    goals: 'Reach 5000 people, 3% engagement rate, 200 new followers',
    keyDates: 'Oct 5: World Mental Health Day, Oct 10: Launch campaign'
  });

  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Tips for better sleep',
      category: 'Video Idea',
      suggestedBy: 'Maria',
      status: 'Approved',
      targetMonth: 'October'
    },
    {
      id: 2,
      title: 'Meet the team - Dr. John',
      category: 'Video Idea',
      suggestedBy: 'Team',
      status: 'Idea',
      targetMonth: 'October'
    }
  ]);

  const [teamMembers] = useState([
    { name: 'Maria', availability: 'Available Mon-Wed' },
    { name: 'John', availability: 'Available Thu-Fri' },
    { name: 'Sarah', availability: 'Available all week' }
  ]);

  const [editingStrategy, setEditingStrategy] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    category: 'Video Idea',
    suggestedBy: '',
    status: 'Idea',
    targetMonth: 'October'
  });

  const handleSaveStrategy = () => {
    setEditingStrategy(false);
    alert('Monthly strategy saved!');
  };

  const handleAddIdea = () => {
    if (!newIdea.title || !newIdea.suggestedBy) {
      alert('Please fill in title and suggested by');
      return;
    }
    setIdeas([...ideas, { ...newIdea, id: Date.now() }]);
    setNewIdea({
      title: '',
      category: 'Video Idea',
      suggestedBy: '',
      status: 'Idea',
      targetMonth: 'October'
    });
  };

  const handleDeleteIdea = (id) => {
    if (window.confirm('Delete this idea?')) {
      setIdeas(ideas.filter(i => i.id !== id));
    }
  };

  return (
    <div className="planning-container">
      <h1>Planning & Strategy</h1>

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
          <h3>Submit New Idea</h3>
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
          </div>
          <button className="btn-primary" onClick={handleAddIdea}>Add Idea</button>
        </div>

        <div className="ideas-list">
          <h3>All Ideas ({ideas.length})</h3>
          {ideas.length === 0 ? (
            <p>No ideas yet. Be the first to suggest one!</p>
          ) : (
            <table className="ideas-table">
              <thead>
                <tr>
                  <th>Idea</th>
                  <th>Category</th>
                  <th>Suggested By</th>
                  <th>Target Month</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map(idea => (
                  <tr key={idea.id}>
                    <td>{idea.title}</td>
                    <td>{idea.category}</td>
                    <td>{idea.suggestedBy}</td>
                    <td>{idea.targetMonth}</td>
                    <td>
                      <span className={`status-tag ${idea.status.toLowerCase()}`}>
                        {idea.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDeleteIdea(idea.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Planning;
