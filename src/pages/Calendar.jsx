import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

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

function Calendar() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      date: '2026-10-05',
      platform: 'Instagram',
      contentType: '1-min Video',
      caption: 'Sample educational post about health',
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

  const getStatusColor = (status) => {
    const colors = {
      'Content Planning': '#FFB6C1',
      'Content Draft': '#FFD700',
      'Schedule Shooting': '#87CEEB',
      'Shooting': '#FF6347',
      'Editing': '#DDA0DD',
      'Review by Management': '#FFA500',
      'Schedule Posting': '#98FB98',
      'Posted': '#32CD32',
      'Archived': '#A9A9A9'
    };
    return colors[status] || '#E0E0E0';
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Content Calendar</h1>
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
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Caption (first 100 chars)"
              maxLength="100"
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
              placeholder="Video Link (if applicable)"
            />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              placeholder="Assigned To (team member)"
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

      <div className="posts-list">
        <h2>All Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Create your first one!</p>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Caption</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.date}</td>
                  <td>{post.platform}</td>
                  <td>{post.contentType}</td>
                  <td>{post.caption.substring(0, 30)}...</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(post.status) }}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>{post.assignedTo}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditPost(post)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Calendar;
