import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createPost, updatePost, deletePost, getTeamPosts } from '../services/firestore.service';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/CalendarNew.css';

const STATUSES = [
  'Content Planning',
  'Content Draft',
  'Schedule Shooting',
  'Shooting',
  'Editing',
  'Review by Management',
  'Schedule Posting',
  'Posted',
  'Archived'
];

const PLATFORMS = ['Instagram', 'Facebook'];
const CONTENT_TYPES = ['1-min Video', '10-30sec Video', 'Static Post'];

const STATUS_SECTIONS = {
  'Content Planning': { color: '#FFB6C1', group: 'Planning' },
  'Content Draft': { color: '#FFD700', group: 'Planning' },
  'Schedule Shooting': { color: '#87CEEB', group: 'Production' },
  'Shooting': { color: '#FF6347', group: 'Production' },
  'Editing': { color: '#DDA0DD', group: 'Production' },
  'Review by Management': { color: '#FFA500', group: 'Review' },
  'Schedule Posting': { color: '#98FB98', group: 'Publishing' },
  'Posted': { color: '#32CD32', group: 'Published' },
  'Archived': { color: '#A9A9A9', group: 'Archived' }
};

function CalendarNew() {
  const { userProfile, teamId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    platform: 'Instagram',
    contentType: '1-min Video',
    caption: '',
    videoTitle: '',
    videoLink: '',
    status: 'Content Planning',
    assignedTo: [],
    notes: ''
  });

  const [copiedId, setCopiedId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9)); // October 2026

  // Load team members and posts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load team members
        const q = query(collection(db, 'team_members'), where('teamId', '==', teamId || 'default-team'));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeamMembers(members);

        // Load posts
        const teamPosts = await getTeamPosts(teamId || 'default-team');
        setPosts(teamPosts);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadData();
    }
  }, [teamId]);

  const handleCopyCaption = (caption, id) => {
    navigator.clipboard.writeText(caption);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddPost = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({
      date: '',
      platform: 'Instagram',
      contentType: '1-min Video',
      caption: '',
      videoTitle: '',
      videoLink: '',
      status: 'Content Planning',
      assignedTo: [],
      notes: ''
    });
  };

  const handleSavePost = async () => {
    if (!formData.date) {
      alert('Please fill in Date');
      return;
    }

    try {
      if (editingId) {
        // Update existing post
        await updatePost(editingId, {
          ...formData,
          scheduledDate: new Date(formData.date),
          createdBy: userProfile?.uid || 'admin-001',
        });
        const updatedPosts = posts.map(p => p.id === editingId ? { ...formData, id: editingId } : p);
        setPosts(updatedPosts);
      } else {
        // Create new post
        const postId = await createPost(teamId || 'default-team', {
          ...formData,
          scheduledDate: new Date(formData.date),
          createdBy: userProfile?.uid || 'admin-001',
        });
        setPosts([...posts, { ...formData, id: postId }]);
      }
      setShowForm(false);
    } catch (err) {
      alert('Error saving post: ' + err.message);
    }
  };

  const handleEditPost = (post) => {
    setFormData(post);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await deletePost(id);
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        alert('Error deleting post: ' + err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleMember = (memberId) => {
    setFormData(prev => {
      const assignedTo = prev.assignedTo || [];
      if (assignedTo.includes(memberId)) {
        return { ...prev, assignedTo: assignedTo.filter(id => id !== memberId) };
      } else {
        return { ...prev, assignedTo: [...assignedTo, memberId] };
      }
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayPosts = getPostsForDate(day);
      days.push(
        <div key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          <div className="day-posts">
            {dayPosts.map(post => (
              <div key={post.id} className="post-indicator" style={{ backgroundColor: STATUS_SECTIONS[post.status].color }} title={post.platform}>
                {post.contentType.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const getPostsBySection = (section) => {
    return posts.filter(p => STATUS_SECTIONS[p.status]?.group === section);
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-new-container">
      <div className="calendar-header">
        <h1>📅 Content Calendar</h1>
        <button className="btn-primary" onClick={handleAddPost}>+ Add Post</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Post' : 'Add New Post'}</h2>
          <div className="form-grid">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Date"
            />
            <select name="platform" value={formData.platform} onChange={handleInputChange}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select name="contentType" value={formData.contentType} onChange={handleInputChange}>
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Caption"
              rows="3"
            />
            <input
              type="text"
              name="videoTitle"
              value={formData.videoTitle}
              onChange={handleInputChange}
              placeholder="Video Topic/Title"
            />
            <input
              type="url"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder="Video Link"
            />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="member-checkboxes">
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Assign to Members:</label>
              {teamMembers.map(member => (
                <div key={member.id} style={{ marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={formData.assignedTo?.includes(member.id) || false}
                    onChange={() => handleToggleMember(member.id)}
                  />
                  <label htmlFor={`member-${member.id}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              rows="2"
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleSavePost}>Save Post</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Calendar Grid View */}
      <div className="calendar-grid-card">
        <div className="calendar-title">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>←</button>
          <h2>{monthName}</h2>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>→</button>
        </div>

        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Posts by Section */}
      <div className="posts-by-section">
        {['Planning', 'Production', 'Review', 'Publishing', 'Published', 'Archived'].map(section => {
          const sectionPosts = getPostsBySection(section);
          if (sectionPosts.length === 0) return null;

          return (
            <div key={section} className="section-card">
              <h3>{section} ({sectionPosts.length})</h3>
              <div className="posts-grid">
                {sectionPosts.map(post => (
                  <div key={post.id} className="post-card" style={{ borderLeftColor: STATUS_SECTIONS[post.status].color }}>
                    <div className="post-header">
                      <h4>{post.videoTitle || 'Untitled'}</h4>
                      <span className="status-badge" style={{ backgroundColor: STATUS_SECTIONS[post.status].color }}>
                        {post.status}
                      </span>
                    </div>
                    <div className="post-meta">
                      <span>{post.platform}</span>
                      <span>{post.contentType}</span>
                    </div>
                    <div className="post-date">{post.date}</div>
                    {post.caption && (
                      <div className="post-caption">
                        <p>{post.caption}</p>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyCaption(post.caption, post.id)}
                          title="Copy caption"
                        >
                          {copiedId === post.id ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                    <div className="post-assigned">
                      {Array.isArray(post.assignedTo) && post.assignedTo.length > 0 ? (
                        <>
                          <strong>Assigned:</strong> {post.assignedTo.map(id => {
                            const member = teamMembers.find(m => m.id === id);
                            return member?.name || 'Unknown';
                          }).join(', ')}
                        </>
                      ) : post.assignedTo ? (
                        <>
                          <strong>Assigned:</strong> {teamMembers.find(m => m.id === post.assignedTo)?.name || 'Unknown'}
                        </>
                      ) : (
                        <span style={{ color: '#ccc' }}>Not assigned</span>
                      )}
                    </div>
                    <div className="post-actions">
                      <button className="btn-edit" onClick={() => handleEditPost(post)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarNew;
