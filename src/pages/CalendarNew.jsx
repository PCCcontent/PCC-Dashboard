import React, { useState, useEffect } from 'react';
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
  const [posts, setPosts] = useState([
    {
      id: 1,
      date: '2026-10-05',
      platform: 'Instagram',
      contentType: '1-min Video',
      caption: 'Sample educational post about health and wellness tips for better living',
      videoFileName: 'video_001.mp4',
      videoLink: 'https://example.com/video_001.mp4',
      status: 'Posted',
      assignedTo: 'John Doe',
      notes: 'Performed well'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    platform: 'Instagram',
    contentType: '1-min Video',
    caption: '',
    videoFileName: '',
    videoLink: '',
    status: 'Content Planning',
    assignedTo: '',
    notes: ''
  });

  const [copiedId, setCopiedId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9)); // October 2026

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
      videoFileName: '',
      videoLink: '',
      status: 'Content Planning',
      assignedTo: '',
      notes: ''
    });
  };

  const handleSavePost = () => {
    if (!formData.date || !formData.caption) {
      alert('Please fill in Date and Caption');
      return;
    }

    if (editingId) {
      setPosts(posts.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
      setEditingId(null);
    } else {
      setPosts([...posts, { ...formData, id: Date.now() }]);
    }

    setShowForm(false);
  };

  const handleEditPost = (post) => {
    setFormData(post);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
              name="videoFileName"
              value={formData.videoFileName}
              onChange={handleInputChange}
              placeholder="Video File Name"
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
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              placeholder="Assigned To"
            />
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
                      <span className="status-badge" style={{ backgroundColor: STATUS_SECTIONS[post.status].color }}>
                        {post.status}
                      </span>
                      <span className="platform">{post.platform}</span>
                    </div>
                    <div className="post-date">{post.date}</div>
                    <div className="post-type">{post.contentType}</div>
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
                    <div className="post-assigned">{post.assignedTo}</div>
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
