import React, { useState } from 'react';
import '../styles/Analytics.css';

function Analytics() {
  const [metrics, setMetrics] = useState([
    {
      id: 1,
      postDate: '2026-10-05',
      platform: 'Instagram',
      contentType: '1-min Video',
      views: 1234,
      engagement: 45,
      likes: 30,
      comments: 8,
      shares: 5,
      followers_growth: 12
    }
  ]);

  const [newMetric, setNewMetric] = useState({
    postDate: '',
    platform: 'Instagram',
    contentType: '1-min Video',
    views: '',
    engagement: '',
    likes: '',
    comments: '',
    shares: '',
    followers_growth: ''
  });

  const handleAddMetric = () => {
    if (!newMetric.postDate || !newMetric.views) {
      alert('Please fill in Post Date and Views');
      return;
    }
    setMetrics([...metrics, { ...newMetric, id: Date.now() }]);
    setNewMetric({
      postDate: '',
      platform: 'Instagram',
      contentType: '1-min Video',
      views: '',
      engagement: '',
      likes: '',
      comments: '',
      shares: '',
      followers_growth: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };

  const calculateStats = () => {
    if (metrics.length === 0) return {};
    const totalViews = metrics.reduce((sum, m) => sum + parseInt(m.views || 0), 0);
    const avgEngagement = (metrics.reduce((sum, m) => sum + parseInt(m.engagement || 0), 0) / metrics.length).toFixed(1);
    const totalFollowerGrowth = metrics.reduce((sum, m) => sum + parseInt(m.followers_growth || 0), 0);

    return {
      totalViews,
      avgEngagement,
      totalFollowerGrowth,
      postCount: metrics.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="analytics-container">
      <h1>📊 Analytics Dashboard</h1>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Views</h3>
          <p className="stat-value">{stats.totalViews || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Engagement</h3>
          <p className="stat-value">{stats.avgEngagement || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-value">{stats.postCount || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Follower Growth</h3>
          <p className="stat-value">+{stats.totalFollowerGrowth || 0}</p>
        </div>
      </div>

      {/* Add Metrics */}
      <div className="metrics-form-card">
        <h2>Add Post Metrics</h2>
        <div className="form-grid">
          <input
            type="date"
            name="postDate"
            value={newMetric.postDate}
            onChange={handleInputChange}
            placeholder="Post Date"
          />
          <select
            name="platform"
            value={newMetric.platform}
            onChange={handleInputChange}
          >
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
          <select
            name="contentType"
            value={newMetric.contentType}
            onChange={handleInputChange}
          >
            <option>1-min Video</option>
            <option>10-30sec Video</option>
            <option>Static Post</option>
          </select>
          <input
            type="number"
            name="views"
            value={newMetric.views}
            onChange={handleInputChange}
            placeholder="Views"
          />
          <input
            type="number"
            name="engagement"
            value={newMetric.engagement}
            onChange={handleInputChange}
            placeholder="Engagement"
          />
          <input
            type="number"
            name="likes"
            value={newMetric.likes}
            onChange={handleInputChange}
            placeholder="Likes"
          />
          <input
            type="number"
            name="comments"
            value={newMetric.comments}
            onChange={handleInputChange}
            placeholder="Comments"
          />
          <input
            type="number"
            name="shares"
            value={newMetric.shares}
            onChange={handleInputChange}
            placeholder="Shares"
          />
          <input
            type="number"
            name="followers_growth"
            value={newMetric.followers_growth}
            onChange={handleInputChange}
            placeholder="Followers Growth"
          />
        </div>
        <button className="btn-primary" onClick={handleAddMetric}>Add Metric</button>
      </div>

      {/* Metrics Table */}
      <div className="metrics-table-card">
        <h2>Post Performance ({metrics.length} posts)</h2>
        {metrics.length === 0 ? (
          <p>No metrics yet. Add some to see performance data!</p>
        ) : (
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Views</th>
                <th>Engagement</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Shares</th>
                <th>Followers +</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => (
                <tr key={metric.id}>
                  <td>{metric.postDate}</td>
                  <td>{metric.platform}</td>
                  <td>{metric.contentType}</td>
                  <td>{metric.views}</td>
                  <td><strong>{metric.engagement}</strong></td>
                  <td>{metric.likes}</td>
                  <td>{metric.comments}</td>
                  <td>{metric.shares}</td>
                  <td>+{metric.followers_growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="coming-soon">
        <p>📈 Charts & Trend Analysis - Coming Soon!</p>
      </div>
    </div>
  );
}

export default Analytics;
