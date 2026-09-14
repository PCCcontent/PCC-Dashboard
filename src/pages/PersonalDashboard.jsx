import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserPosts, getUserAssignedPosts } from '../services/firestore.service';
import '../styles/PersonalDashboard.css';

function PersonalDashboard() {
  const { currentUser, userProfile, teamId } = useAuth();
  const [ownPosts, setOwnPosts] = useState([]);
  const [assignedPosts, setAssignedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      if (!teamId || !currentUser) return;

      try {
        const own = await getUserPosts(teamId, currentUser.uid);
        const assigned = await getUserAssignedPosts(teamId, currentUser.uid);
        setOwnPosts(own);
        setAssignedPosts(assigned);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [teamId, currentUser]);

  const allPosts = [...ownPosts, ...assignedPosts];

  return (
    <div className="dashboard-container">
      <h1>My Dashboard</h1>

      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {userProfile?.name}</h2>
          <p className="role-badge">{userProfile?.role}</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">My Posts</div>
          <div className="stat-value">{ownPosts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Assigned to Me</div>
          <div className="stat-value">{assignedPosts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{allPosts.length}</div>
        </div>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {ownPosts.length > 0 && (
            <div className="posts-section">
              <h3>My Posts ({ownPosts.length})</h3>
              <div className="posts-list">
                {ownPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <h4>{post.title}</h4>
                      <span className="status-badge" data-status={post.status}>{post.status}</span>
                    </div>
                    <p className="post-platform">{post.platform} • {post.contentType}</p>
                    <p className="post-date">{new Date(post.scheduledDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedPosts.length > 0 && (
            <div className="posts-section">
              <h3>Assigned to Me ({assignedPosts.length})</h3>
              <div className="posts-list">
                {assignedPosts.map(post => (
                  <div key={post.id} className="post-card assigned">
                    <div className="post-header">
                      <h4>{post.title}</h4>
                      <span className="status-badge" data-status={post.status}>{post.status}</span>
                    </div>
                    <p className="post-platform">{post.platform} • {post.contentType}</p>
                    <p className="post-date">{new Date(post.scheduledDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allPosts.length === 0 && (
            <div className="empty-state">
              <p>No posts yet. Check back soon!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PersonalDashboard;
