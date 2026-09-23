import React, { useState } from 'react';
import '../styles/AnalyticsNew.css';

function AnalyticsNew() {
  const [metrics, setMetrics] = useState([
    {
      id: 1,
      postDate: '2026-10-05',
      platform: 'Instagram',
      contentType: 'Reels',
      totalViews: 1234,
      followersViewsRate: 60,
      totalInteraction: 45,
      followersInteractionRate: 62,
      likes: 30,
      comments: 8,
      shares: 5
    },
    {
      id: 2,
      postDate: '2026-10-08',
      platform: 'Facebook',
      contentType: 'Static Post',
      totalViews: 890,
      followersViewsRate: 67,
      totalInteraction: 28,
      followersInteractionRate: 64,
      likes: 20,
      comments: 5,
      shares: 3
    },
    {
      id: 3,
      postDate: '2026-10-10',
      platform: 'Instagram',
      contentType: 'Short Reels',
      totalViews: 2100,
      followersViewsRate: 60,
      totalInteraction: 85,
      followersInteractionRate: 53,
      likes: 45,
      comments: 15,
      shares: 8
    }
  ]);

  const [newMetric, setNewMetric] = useState({
    postDate: '',
    platform: 'Instagram',
    contentType: 'Reels',
    totalViews: '',
    followersViewsRate: '',
    totalInteraction: '',
    followersInteractionRate: '',
    likes: '',
    comments: '',
    shares: ''
  });

  const [filterMonth, setFilterMonth] = useState('');
  const [filterContentType, setFilterContentType] = useState('');
  const [editingId, setEditingId] = useState(null);

  const CONTENT_TYPES = ['KOL', 'Reels', 'Short Reels', 'Static Post'];

  const getContentTypeColor = (type) => {
    const colors = {
      'KOL': '#667eea',
      'Reels': '#764ba2',
      'Short Reels': '#f093fb',
      'Static Post': '#4facfe'
    };
    return colors[type] || '#667eea';
  };

  const handleAddMetric = () => {
    if (!newMetric.postDate || !newMetric.totalViews) {
      alert('Please fill in Post Date and Total Views');
      return;
    }
    if (editingId) {
      // Update existing metric
      setMetrics(metrics.map(m => m.id === editingId ? { ...newMetric, id: editingId } : m));
      setEditingId(null);
    } else {
      // Add new metric
      setMetrics([...metrics, { ...newMetric, id: Date.now() }]);
    }
    setNewMetric({
      postDate: '',
      platform: 'Instagram',
      contentType: 'Reels',
      totalViews: '',
      followersViewsRate: '',
      totalInteraction: '',
      followersInteractionRate: '',
      likes: '',
      comments: '',
      shares: ''
    });
  };

  const handleEditMetric = (metric) => {
    setNewMetric(metric);
    setEditingId(metric.id);
    window.scrollTo(0, 0);
  };

  const handleDeleteMetric = (id) => {
    if (window.confirm('Delete this metric?')) {
      setMetrics(metrics.filter(m => m.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewMetric({
      postDate: '',
      platform: 'Instagram',
      contentType: 'Reels',
      totalViews: '',
      followersViewsRate: '',
      totalInteraction: '',
      followersInteractionRate: '',
      likes: '',
      comments: '',
      shares: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };

  const getFilteredMetrics = () => {
    return metrics.filter(m => {
      const month = m.postDate.slice(0, 7); // YYYY-MM format
      const monthMatch = !filterMonth || month === filterMonth;
      const typeMatch = !filterContentType || m.contentType === filterContentType;
      return monthMatch && typeMatch;
    });
  };

  const calculateStats = () => {
    const filtered = getFilteredMetrics();
    if (filtered.length === 0) return {};
    const totalViews = filtered.reduce((sum, m) => sum + parseInt(m.totalViews || 0), 0);
    const totalInteraction = filtered.reduce((sum, m) => sum + parseInt(m.totalInteraction || 0), 0);
    const avgViews = (totalViews / filtered.length).toFixed(0);
    const avgInteraction = (totalInteraction / filtered.length).toFixed(0);

    return { totalViews, totalInteraction, avgInteraction, postCount: filtered.length, avgViews };
  };

  const getMetricsByType = () => {
    const filtered = getFilteredMetrics();
    const types = {};
    filtered.forEach(m => {
      if (!types[m.contentType]) types[m.contentType] = { count: 0, totalViews: 0, totalInteraction: 0 };
      types[m.contentType].count++;
      types[m.contentType].totalViews += parseInt(m.totalViews || 0);
      types[m.contentType].totalInteraction += parseInt(m.totalInteraction || 0);
    });
    return Object.entries(types).map(([type, data]) => ({
      type,
      avgViews: (data.totalViews / data.count).toFixed(0),
      avgInteraction: (data.totalInteraction / data.count).toFixed(0),
      count: data.count
    }));
  };

  const getMetricsByPlatform = () => {
    const filtered = getFilteredMetrics();
    const platforms = {};
    filtered.forEach(m => {
      if (!platforms[m.platform]) platforms[m.platform] = { count: 0, totalViews: 0, totalInteraction: 0 };
      platforms[m.platform].count++;
      platforms[m.platform].totalViews += parseInt(m.totalViews || 0);
      platforms[m.platform].totalInteraction += parseInt(m.totalInteraction || 0);
    });
    return Object.entries(platforms).map(([platform, data]) => ({
      platform,
      avgViews: (data.totalViews / data.count).toFixed(0),
      avgInteraction: (data.totalInteraction / data.count).toFixed(0),
      count: data.count
    }));
  };

  const stats = calculateStats();
  const typeData = getMetricsByType();
  const platformData = getMetricsByPlatform();

  return (
    <div className="analytics-new-container">
      <h1>📊 Analytics Dashboard</h1>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-group">
          <div className="filter-item">
            <label>Filter by Month:</label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
            {filterMonth && (
              <button className="btn-clear" onClick={() => setFilterMonth('')}>Clear</button>
            )}
          </div>
          <div className="filter-item">
            <label>Filter by Content Type:</label>
            <select
              value={filterContentType}
              onChange={(e) => setFilterContentType(e.target.value)}
            >
              <option value="">All Types</option>
              {CONTENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
          <h3>Total Interaction</h3>
          <p className="stat-value">{stats.totalInteraction || 0}</p>
          <p className="stat-label">All posts</p>
        </div>
        <div className="stat-card">
          <h3>Avg Interaction</h3>
          <p className="stat-value">{stats.avgInteraction || 0}</p>
          <p className="stat-label">Per post</p>
        </div>
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-value">{stats.postCount || 0}</p>
          <p className="stat-label">In filters</p>
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
                    style={{
                      height: `${(item.avgViews / Math.max(...typeData.map(d => d.avgViews)) * 100)}%`,
                      background: getContentTypeColor(item.type)
                    }}
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

        {/* Interaction by Platform Chart */}
        <div className="chart-card">
          <h3>👥 Avg Interaction by Platform</h3>
          <div className="bar-chart">
            {platformData.map((item, idx) => (
              <div key={idx} className="chart-bar">
                <div className="bar-container">
                  <div
                    className="bar interaction-bar"
                    style={{ height: `${(item.avgInteraction / Math.max(...platformData.map(d => d.avgInteraction)) * 100)}%` }}
                  ></div>
                </div>
                <div className="bar-label">
                  <div className="platform-name">{item.platform}</div>
                  <div className="bar-value">{item.avgInteraction}</div>
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
              <div>Avg Interaction</div>
            </div>
            {typeData.map((item, idx) => (
              <div key={idx} className="comp-row">
                <div>{item.type}</div>
                <div>{item.count}</div>
                <div>{item.avgViews}</div>
                <div>{item.avgInteraction}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Metrics */}
      <div className="metrics-form-card">
        <h2>{editingId ? 'Edit Metric' : 'Add Post Metrics'}</h2>
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
            {CONTENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div style={{ gridColumn: 'span 3', fontSize: '13px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
            Views & Followers
          </div>
          <input
            type="number"
            name="totalViews"
            value={newMetric.totalViews}
            onChange={handleInputChange}
            placeholder="Total Views"
          />
          <input
            type="number"
            name="followersViewsRate"
            value={newMetric.followersViewsRate}
            onChange={handleInputChange}
            placeholder="Followers Views Rate (%)"
            min="0"
            max="100"
          />

          <div style={{ gridColumn: 'span 3', fontSize: '13px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
            Interaction & Followers
          </div>
          <input
            type="number"
            name="totalInteraction"
            value={newMetric.totalInteraction}
            onChange={handleInputChange}
            placeholder="Total Interaction (number)"
          />
          <input
            type="number"
            name="followersInteractionRate"
            value={newMetric.followersInteractionRate}
            onChange={handleInputChange}
            placeholder="Followers Interaction Rate (%)"
            min="0"
            max="100"
          />

          <div style={{ gridColumn: 'span 3', fontSize: '13px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
            Details
          </div>
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
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleAddMetric}>
            {editingId ? 'Update Metric' : 'Add Metric'}
          </button>
          {editingId && (
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          )}
        </div>
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
                <th>Type</th>
                <th>Platform</th>
                <th>Total Views</th>
                <th>Followers Views</th>
                <th>Non-Followers Views</th>
                <th>Total Interaction</th>
                <th>Followers Interaction</th>
                <th>Non-Followers Interaction</th>
                <th>Likes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredMetrics().map(metric => {
                const followersViewsCount = (metric.totalViews * (metric.followersViewsRate / 100)).toFixed(0);
                const nonFollowersViewsCount = (metric.totalViews - followersViewsCount).toFixed(0);
                const followersInteractionCount = (metric.totalInteraction * (metric.followersInteractionRate / 100)).toFixed(0);
                const nonFollowersInteractionCount = (metric.totalInteraction - followersInteractionCount).toFixed(0);

                return (
                  <tr key={metric.id}>
                    <td>{metric.postDate}</td>
                    <td>{metric.contentType}</td>
                    <td>{metric.platform}</td>
                    <td><strong>{metric.totalViews}</strong></td>
                    <td>{metric.followersViewsRate}% ({followersViewsCount})</td>
                    <td>{(100 - metric.followersViewsRate)}% ({nonFollowersViewsCount})</td>
                    <td><strong style={{ color: '#667eea' }}>{metric.totalInteraction}</strong></td>
                    <td>{metric.followersInteractionRate}% ({followersInteractionCount})</td>
                    <td>{(100 - metric.followersInteractionRate)}% ({nonFollowersInteractionCount})</td>
                    <td>{metric.likes}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEditMetric(metric)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteMetric(metric.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AnalyticsNew;
