import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import '../styles/analysis.css';
import AdminPanel from './Adminpanel';
import { 
  FiRefreshCw,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiBarChart2,
  FiUsers,
  FiCalendar,
  FiAward,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi';

const Analysis = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/api/history/all/histories');
      
      if (response.data.success) {
        setHistory(response.data.data || []);
      } else {
        setError('Failed to fetch history data');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Failed to load analysis history');
      if (err.response?.status === 404) {
        setError('Analysis endpoint not found');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  // Helper function to extract grade string from skinGrade (which can be string or object)
  const extractGrade = (skinGrade) => {
    if (!skinGrade) return 'Unknown';
    if (typeof skinGrade === 'object') {
      return skinGrade.grade || 'Unknown';
    }
    return skinGrade;
  };

  // Helper function to get the base grade (A, B, C, D) from a grade string
  const getBaseGrade = (gradeStr) => {
    if (!gradeStr) return 'Unknown';
    const grade = gradeStr.toString().toUpperCase();
    if (grade.startsWith('A')) return 'A';
    if (grade.startsWith('B')) return 'B';
    if (grade.startsWith('C')) return 'C';
    if (grade.startsWith('D')) return 'D';
    return 'Unknown';
  };

  const calculateSummary = () => {
    if (history.length === 0) return null;

    const total = history.length;
    const uniqueUsers = [...new Set(history.map(item => item.userEmail))].length;
    
    // Process each history item to get base grades
    const gradeCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      Unknown: 0
    };

    history.forEach(item => {
      const gradeStr = extractGrade(item.skinGrade);
      const baseGrade = getBaseGrade(gradeStr);
      gradeCounts[baseGrade] = (gradeCounts[baseGrade] || 0) + 1;
    });

    const conditions = history.reduce((acc, item) => {
      const condition = item.overallCondition || 'Unknown';
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});

    const mostCommonCondition = Object.keys(conditions).reduce((a, b) => 
      conditions[a] > conditions[b] ? a : b
    );

    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const recentGrades = history.filter(item => new Date(item.timestamp) > oneWeekAgo);
    
    const recentGradeCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      Unknown: 0
    };

    recentGrades.forEach(item => {
      const gradeStr = extractGrade(item.skinGrade);
      const baseGrade = getBaseGrade(gradeStr);
      recentGradeCounts[baseGrade] = (recentGradeCounts[baseGrade] || 0) + 1;
    });

    // Calculate user progress
    const userProgress = {};
    history.forEach(item => {
      if (!item.userEmail) return;
      if (!userProgress[item.userEmail]) {
        userProgress[item.userEmail] = [];
      }
      userProgress[item.userEmail].push({
        grade: extractGrade(item.skinGrade),
        date: new Date(item.timestamp)
      });
    });

    let improvedUsers = 0;
    let declinedUsers = 0;
    let stableUsers = 0;

    Object.values(userProgress).forEach(grades => {
      if (grades.length > 1) {
        grades.sort((a, b) => a.date - b.date);
        const firstGrade = getBaseGrade(grades[0].grade);
        const lastGrade = getBaseGrade(grades[grades.length - 1].grade);
        
        // Compare based on grade order (A > B > C > D)
        const gradeOrder = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'Unknown': 0 };
        
        if (gradeOrder[firstGrade] < gradeOrder[lastGrade]) improvedUsers++;
        else if (gradeOrder[firstGrade] > gradeOrder[lastGrade]) declinedUsers++;
        else stableUsers++;
      }
    });

    return {
      total,
      uniqueUsers,
      gradeStats: gradeCounts,
      gradePercentages: {
        A: ((gradeCounts.A / total) * 100).toFixed(1),
        B: ((gradeCounts.B / total) * 100).toFixed(1),
        C: ((gradeCounts.C / total) * 100).toFixed(1),
        D: ((gradeCounts.D / total) * 100).toFixed(1),
      },
      recentGradeStats: recentGradeCounts,
      recentGradePercentages: {
        A: recentGrades.length > 0 ? ((recentGradeCounts.A / recentGrades.length) * 100).toFixed(1) : '0',
        B: recentGrades.length > 0 ? ((recentGradeCounts.B / recentGrades.length) * 100).toFixed(1) : '0',
        C: recentGrades.length > 0 ? ((recentGradeCounts.C / recentGrades.length) * 100).toFixed(1) : '0',
        D: recentGrades.length > 0 ? ((recentGradeCounts.D / recentGrades.length) * 100).toFixed(1) : '0',
      },
      mostCommonCondition,
      mostCommonConditionCount: conditions[mostCommonCondition],
      improvementStats: {
        improved: improvedUsers,
        declined: declinedUsers,
        stable: stableUsers,
        totalWithProgress: improvedUsers + declinedUsers + stableUsers
      },
      avgAnalysesPerUser: (total / uniqueUsers).toFixed(1),
    };
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#10b981',
      'B': '#3b82f6',
      'C': '#f59e0b',
      'D': '#ef4444'
    };
    return colors[grade] || '#6b7280';
  };

  const getGradeLabel = (grade) => {
    const labels = {
      'A': 'Excellent',
      'B': 'Good',
      'C': 'Fair',
      'D': 'Poor'
    };
    return labels[grade] || 'Unknown';
  };

  const handleExport = () => {
    const headers = ['User Email', 'Skin Grade', 'Overall Condition', 'Date', 'ID'];
    const csv = history.map(analysis => {
      const skinGrade = extractGrade(analysis?.skinGrade);
      return `${analysis?.userEmail || ''},${skinGrade},${analysis?.overallCondition || ''},${new Date(analysis?.timestamp).toLocaleDateString()},${analysis?._id || ''}`;
    }).join('\n');
    const blob = new Blob([`${headers.join(',')}\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminPanel>
        <div className="analysis-scoped-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading analysis data...</p>
          </div>
        </div>
      </AdminPanel>
    );
  }

  const summary = calculateSummary();

  return (
    <AdminPanel>
      <div className="analysis-scoped-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Overall Analysis</h1>
            <p className="page-subtitle">Comprehensive skin health analytics</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchAllHistory} className="icon-btn refresh-btn">
              <FiRefreshCw size={16} />
            </button>
            <button onClick={handleExport} className="icon-btn export-btn">
              <FiDownload size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
            <button onClick={fetchAllHistory} className="alert-action">
              Retry
            </button>
          </div>
        )}

        {summary && (
          <div className="analytics-dashboard">
            <div className="top-stats-grid">
              <div className="top-stat-item">
                <div className="top-stat-icon" style={{background: '#2d3748'}}>
                  <FiActivity size={18} />
                </div>
                <div className="top-stat-content">
                  <span className="top-stat-value">{summary.total}</span>
                  <span className="top-stat-label">Total Analyses</span>
                </div>
              </div>
              
              <div className="top-stat-item">
                <div className="top-stat-icon" style={{background: '#2d3748'}}>
                  <FiUsers size={18} />
                </div>
                <div className="top-stat-content">
                  <span className="top-stat-value">{summary.uniqueUsers}</span>
                  <span className="top-stat-label">Active Users</span>
                </div>
              </div>
              
              <div className="top-stat-item">
                <div className="top-stat-icon" style={{background: '#10b981'}}>
                  <FiAward size={18} />
                </div>
                <div className="top-stat-content">
                  <span className="top-stat-value">{summary.gradePercentages.A}%</span>
                  <span className="top-stat-label">Grade A Rate</span>
                </div>
              </div>
              
              <div className="top-stat-item">
                <div className="top-stat-icon" style={{background: '#ef4444'}}>
                  <FiAlertTriangle size={18} />
                </div>
                <div className="top-stat-content">
                  <span className="top-stat-value">{summary.gradePercentages.D}%</span>
                  <span className="top-stat-label">Grade D Rate</span>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h3>Skin Grade Distribution</h3>
              </div>
              
              <div className="grade-distribution-cards">
                {['A', 'B', 'C', 'D'].map(grade => (
                  <div key={grade} className="grade-card" style={{borderLeftColor: getGradeColor(grade)}}>
                    <div className="grade-card-header">
                      <div 
                        className="grade-indicator" 
                        style={{backgroundColor: getGradeColor(grade)}}
                      >
                        {grade}
                      </div>
                      <div>
                        <span className="grade-label">{getGradeLabel(grade)}</span>
                        <div className="grade-trend">
                          {summary.recentGradePercentages[grade]}% recent
                        </div>
                      </div>
                    </div>
                    <div className="grade-card-body">
                      <div className="grade-count">{summary.gradeStats[grade]}</div>
                      <div className="grade-percentage">{summary.gradePercentages[grade]}%</div>
                    </div>
                    <div className="grade-progress">
                      <div 
                        className="grade-progress-bar"
                        style={{
                          width: `${summary.gradePercentages[grade]}%`,
                          backgroundColor: getGradeColor(grade)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h3>User Progress</h3>
              </div>
              
              <div className="progress-bars">
                <div className="progress-bar-item improved">
                  <div className="progress-bar-label">
                    <FiTrendingUp size={12} />
                    <span>Improved</span>
                  </div>
                  <div className="progress-bar-value">
                    {summary.improvementStats.improved} users
                    <span className="progress-percent">
                      {summary.improvementStats.totalWithProgress > 0 ? 
                        ((summary.improvementStats.improved / summary.improvementStats.totalWithProgress) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: summary.improvementStats.totalWithProgress > 0 ? 
                              `${(summary.improvementStats.improved / summary.improvementStats.totalWithProgress) * 100}%` : '0%',
                        backgroundColor: '#10b981'
                      }}
                    />
                  </div>
                </div>
                
                <div className="progress-bar-item stable">
                  <div className="progress-bar-label">
                    <FiCheckCircle size={12} />
                    <span>Stable</span>
                  </div>
                  <div className="progress-bar-value">
                    {summary.improvementStats.stable} users
                    <span className="progress-percent">
                      {summary.improvementStats.totalWithProgress > 0 ? 
                        ((summary.improvementStats.stable / summary.improvementStats.totalWithProgress) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: summary.improvementStats.totalWithProgress > 0 ? 
                              `${(summary.improvementStats.stable / summary.improvementStats.totalWithProgress) * 100}%` : '0%',
                        backgroundColor: '#3b82f6'
                      }}
                    />
                  </div>
                </div>
                
                <div className="progress-bar-item declined">
                  <div className="progress-bar-label">
                    <FiTrendingDown size={12} />
                    <span>Declined</span>
                  </div>
                  <div className="progress-bar-value">
                    {summary.improvementStats.declined} users
                    <span className="progress-percent">
                      {summary.improvementStats.totalWithProgress > 0 ? 
                        ((summary.improvementStats.declined / summary.improvementStats.totalWithProgress) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: summary.improvementStats.totalWithProgress > 0 ? 
                              `${(summary.improvementStats.declined / summary.improvementStats.totalWithProgress) * 100}%` : '0%',
                        backgroundColor: '#ef4444'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h3>Analysis Summary</h3>
              </div>
              
              <div className="summary-insights">
                <div className="insight-item">
                  <div className="insight-icon">
                    <FiBarChart2 size={16} />
                  </div>
                  <div className="insight-content">
                    <h5>Grade Distribution</h5>
                    <p>
                      {parseFloat(summary.gradePercentages.A) > 40 ? 
                        'High prevalence of Grade A analyses' :
                        parseFloat(summary.gradePercentages.D) > 20 ?
                        'Elevated Grade D prevalence' :
                        'Balanced grade distribution'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">
                    <FiUsers size={16} />
                  </div>
                  <div className="insight-content">
                    <h5>User Engagement</h5>
                    <p>
                      Average of {summary.avgAnalysesPerUser} analyses per user
                    </p>
                  </div>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">
                    <FiCalendar size={16} />
                  </div>
                  <div className="insight-content">
                    <h5>Most Common Condition</h5>
                    <p>{summary.mostCommonCondition}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPanel>
  );
};

export default Analysis;