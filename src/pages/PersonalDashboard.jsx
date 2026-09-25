import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getTeamPosts } from '../services/firestore.service';
import '../styles/PersonalDashboard.css';

function PersonalDashboard() {
  const { currentUser, userProfile, teamId } = useAuth();
  const [allTeamPosts, setAllTeamPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      if (!teamId) return;

      try {
        const posts = await getTeamPosts(teamId);
        setAllTeamPosts(posts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [teamId]);

  // Categorize posts
  const isOverdue = (taskDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(taskDate);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const upcomingPosts = allTeamPosts.filter(post => !post.isCompleted && !isOverdue(post.scheduledDate?.toDate?.() || post.date));
  const overduePosts = allTeamPosts.filter(post => !post.isCompleted && isOverdue(post.scheduledDate?.toDate?.() || post.date));
  const completedPosts = allTeamPosts.filter(post => post.isCompleted);

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
        <div className="stat-card upcoming">
          <div className="stat-label">Upcoming Projects</div>
          <div className="stat-value">{upcomingPosts.length}</div>
        </div>
        <div className="stat-card delayed">
          <div className="stat-label">Delayed Projects</div>
          <div className="stat-value">{overduePosts.length}</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-label">Completed Projects</div>
          <div className="stat-value">{completedPosts.length}</div>
        </div>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {upcomingPosts.length > 0 && (
            <div className="posts-section">
              <h3>Upcoming Projects ({upcomingPosts.length})</h3>
              <div className="posts-list">
                {upcomingPosts.map(post => (
                  <div key={post.id} className="post-card upcoming-post">
                    <div className="post-header">
                      <h4>{post.videoTitle || post.caption?.substring(0, 50) || 'Untitled'}</h4>
                      <span className="status-badge" data-status={post.status}>{post.status}</span>
                    </div>
                    <p className="post-platform">{post.platform} • {post.contentType}</p>
                    <p className="post-date">{new Date(post.scheduledDate?.toDate?.() || post.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {overduePosts.length > 0 && (
            <div className="posts-section">
              <h3>Delayed Projects ({overduePosts.length})</h3>
              <div className="posts-list">
                {overduePosts.map(post => (
                  <div key={post.id} className="post-card delayed-post">
                    <div className="post-header">
                      <h4>{post.videoTitle || post.caption?.substring(0, 50) || 'Untitled'}</h4>
                      <span className="status-badge" data-status={post.status}>{post.status}</span>
                    </div>
                    <p className="post-platform">{post.platform} • {post.contentType}</p>
                    <p className="post-date">{new Date(post.scheduledDate?.toDate?.() || post.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedPosts.length > 0 && (
            <div className="posts-section">
              <h3>Completed Projects ({completedPosts.length})</h3>
              <div className="posts-list">
                {completedPosts.map(post => (
                  <div key={post.id} className="post-card completed-post">
                    <div className="post-header">
                      <h4>{post.videoTitle || post.caption?.substring(0, 50) || 'Untitled'}</h4>
                      <span className="status-badge completed-badge">✓ Completed</span>
                    </div>
                    <p className="post-platform">{post.platform} • {post.contentType}</p>
                    <p className="post-date">{new Date(post.scheduledDate?.toDate?.() || post.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allTeamPosts.length === 0 && (
            <div className="empty-state">
              <p>No projects yet. Check back soon!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PersonalDashboard;
