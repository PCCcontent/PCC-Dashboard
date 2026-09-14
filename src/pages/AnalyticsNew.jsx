import React, { useState } from 'react';
import '../styles/AnalyticsNew.css';

function AnalyticsNew() {
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
    },
    {
      id: 2,
      postDate: '2026-10-08',
      platform: 'Facebook',
      contentType: 'Static Post',
      views: 890,
      engagement: 28,
      likes: 20,
      comments: 5,
      shares: 3,
      followers_growth: 5
    },
    {
      id: 3,
      postDate: '2026-10-10',
      platform: 'Instagram',
      contentType: '10-30sec Video',
      views: 2100,
      engagement: 68,
      likes: 45,
      comments: 15,
      shares: 8,
      followers_growth: 20
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
    const avgViews = (totalViews / metrics.length).toFixed(0);

    return { totalViews, avgEngagement, totalFollowerGrowth, postCount: metrics.length, avgViews };
  };

  const getMetricsByType = () => {
    const types = {};
    metrics.forEach(m => {
      if (!types[m.contentType]) types[m.contentType] = { count: 0, totalViews: 0, totalEngagement: 0 };
      types[m.contentType].count++;
      types[m.contentType].totalViews += parseInt(m.views || 0);
      types[m.contentType].totalEngagement += parseInt(m.engagement || 0);
    });
    return Object.entries(types).map(([type, data]) => ({
      type,
      avgViews: (data.totalViews / data.count).toFixed(0),
      avgEngagement: (data.totalEngagement / data.count).toFixed(1),
      count: data.count
    }));
  };

  const getMetricsByPlatform = () => {
    const platforms = {};
    metrics.forEach(m => {
      if (!platforms[m.platform]) platforms[m.platform] = { count: 0, totalViews: 0, totalEngagement: 0 };
      platforms[m.platform].count++;
      platforms[m.platform].totalViews += parseInt(m.views || 0);
      platforms[m.platform].totalEngagement += parseInt(m.engagement || 0);
    });
    return Object.entries(platforms).map(([platform, data]) => ({
      platform,
      avgViews: (data.totalViews / data.count).toFixed(0),
      avgEngagement: (data.totalEngagement / data.count).toFixed(1),
      count: data.count
    }));
  };

  const stats = calculateStats();
  const typeData = getMetricsByType();
  const platformData = getMetricsByPlatform();

  return (
    <div className="analytics-new-container">
      <h1>📊 Analytics Dashboard</h1>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Views</h3>
          <p className="stat-value">{stats.totalViews || 0}</p>
          <p className="stat-label">All time</p>
        </div>
        <div className="stat-card">
          <h3>Avg Views/Post</h3>
          <p className="stat-value">{stats.avgViews || 0}</p>
          <p className="stat-label">Per post</p>
        </div>
        <div className="stat-card">
          <h3>Avg Engagement</h3>
          <p className="stat-value">{stats.avgEngagement || 0}%</p>
          <p className="stat-label">Per post</p>
        </div>
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-value">{stats.postCount || 0}</p>
          <p className="stat-label">This month</p>
        </div>
        <div className="stat-card">
          <h3>Follower Growth</h3>
          <p className="stat-value">+{stats.totalFollowerGrowth || 0}</p>
          <p className="stat-label">This month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Views by Content Type Chart */}
        <div className="chart-card">
          <h3>📈 Avg Views by Content Type</h3>
          <div className="bar-chart">
            {typeData.map((item, idx) => (
              <div key={idx} className="chart-bar">
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ height: `${(item.avgViews / Math.max(...typeData.map(d => d.avgViews)) * 100)}%` }}
                  ></div>
                </div>
                <div className="bar-label">
                  <div className="type-name">{item.type}</div>
                  <div className="bar-value">{item.avgViews}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement by Platform Chart */}
        <div className="chart-card">
          <h3>👥 Avg Engagement by Platform</h3>
          <div className="bar-chart">
            {platformData.map((item, idx) => (
              <div key={idx} className="chart-bar">
                <div className="bar-container">
                  <div
                    className="bar engagement-bar"
                    style={{ height: `${(item.avgEngagement / Math.max(...platformData.map(d => d.avgEngagement)) * 100)}%` }}
                  ></div>
                </div>
                <div className="bar-label">
                  <div className="platform-name">{item.platform}</div>
                  <div className="bar-value">{item.avgEngagement}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="chart-card">
          <h3>🏆 Content Type Performance</h3>
          <div className="comparison-table">
            <div className="comp-header">
              <div>Type</div>
              <div>Posts</div>
              <div>Avg Views</div>
              <div>Avg Engagement</div>
            </div>
            {typeData.map((item, idx) => (
              <div key={idx} className="comp-row">
                <div>{item.type}</div>
                <div>{item.count}</div>
                <div>{item.avgViews}</div>
                <div>{item.avgEngagement}%</div>
              </div>
            ))}
          </div>
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
                  <td><strong>{metric.views}</strong></td>
                  <td><strong style={{ color: '#667eea' }}>{metric.engagement}</strong></td>
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
    </div>
  );
}

export default AnalyticsNew;
