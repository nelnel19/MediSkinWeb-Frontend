import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/history.css";
import AdminPanel from "./Adminpanel";
import { 
  FiSearch, 
  FiCalendar, 
  FiRefreshCw,
  FiDownload,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiTrash2,
  FiFileText,
  FiX,
  FiExternalLink,
  FiUser,
  FiMail,
  FiTag,
  FiActivity,
  FiCpu,
  FiStar,
  FiInfo
} from "react-icons/fi";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchAllHistory();
  }, [pagination.page]);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/history/all/histories?page=${pagination.page}&limit=${pagination.limit}`);
      const responseData = response.data;
      
      if (responseData.success) {
        setHistories(responseData.data || []);
        setPagination(responseData.pagination || {
          page: 1,
          limit: 20,
          total: responseData.data?.length || 0,
          pages: 1
        });
      } else {
        setHistories([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistories = histories.filter(history => {
    if (!history) return false;
    const searchLower = searchTerm.toLowerCase();
    
    // Search through various fields
    const analysisData = history.analysisData || {};
    
    // Handle skinGrade that could be string or object
    let skinGradeStr = '';
    if (history.skinGrade) {
      if (typeof history.skinGrade === 'object') {
        skinGradeStr = history.skinGrade.grade || '';
      } else {
        skinGradeStr = history.skinGrade;
      }
    }
    
    return (
      (history.userEmail || "").toLowerCase().includes(searchLower) ||
      skinGradeStr.toLowerCase().includes(searchLower) ||
      (history.overallCondition || "").toLowerCase().includes(searchLower) ||
      (analysisData.age || "").toString().toLowerCase().includes(searchLower) ||
      (analysisData.gender || "").toLowerCase().includes(searchLower) ||
      (analysisData.skin_grade?.grade || "").toLowerCase().includes(searchLower)
    );
  });

  const sortedHistories = [...filteredHistories].sort((a, b) => {
    const getValue = (obj, key) => {
      if (key === "skinGrade") {
        if (obj.skinGrade) {
          if (typeof obj.skinGrade === 'object') {
            return obj.skinGrade.grade || '';
          }
          return obj.skinGrade || '';
        }
        return '';
      }
      return obj && obj[key];
    };
    
    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;
    
    if (sortConfig.key === "timestamp") {
      try {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      } catch {
        return 0;
      }
    }
    
    const aStr = String(aValue || "").toLowerCase();
    const bStr = String(bValue || "").toLowerCase();
    if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "—";
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return '#6B7280';
    
    let gradeStr = '';
    if (typeof grade === 'object') {
      gradeStr = grade.grade || '';
    } else if (typeof grade === 'string') {
      gradeStr = grade;
    } else {
      return '#6B7280';
    }
    
    const gradeLower = gradeStr.toLowerCase();
    if (gradeLower.startsWith('a')) return '#10B981';
    if (gradeLower.startsWith('b')) return '#3B82F6';
    if (gradeLower.startsWith('c')) return '#F59E0B';
    if (gradeLower.startsWith('d')) return '#EF4444';
    return '#6B7280';
  };

  const getConditionColor = (condition) => {
    const condLower = (condition || "").toLowerCase();
    if (condLower.includes('excellent')) return '#10B981';
    if (condLower.includes('good')) return '#3B82F6';
    if (condLower.includes('fair')) return '#F59E0B';
    if (condLower.includes('needs improvement')) return '#EF4444';
    return '#6B7280';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await API.delete(`/api/history/${id}`);
        fetchAllHistory();
      } catch (err) {
        console.error('Error deleting history:', err);
      }
    }
  };

  const handleViewDetails = (history) => {
    setSelectedHistory(history);
    setShowModal(true);
  };

  const handleExport = () => {
    const headers = ["User Email", "Skin Grade", "Overall Condition", "Age", "Gender", "Acne Score", "Date"];
    const csv = sortedHistories.map(history => {
      const analysisData = history.analysisData || {};
      
      // Handle skinGrade that could be string or object
      let skinGradeValue = '';
      if (history.skinGrade) {
        if (typeof history.skinGrade === 'object') {
          skinGradeValue = history.skinGrade.grade || '';
        } else {
          skinGradeValue = history.skinGrade;
        }
      }
      
      return [
        history.userEmail || "",
        skinGradeValue,
        history.overallCondition || "",
        analysisData.age || analysisData.estimated_age || 'N/A',
        analysisData.gender || 'N/A',
        analysisData.acne || analysisData.skin_attributes?.acne || 0,
        formatDate(history.timestamp)
      ].map(field => `"${field}"`).join(',');
    }).join('\n');
    
    const blob = new Blob([`${headers.join(',')}\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getInitials = (email) => {
    if (!email) return "??";
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const extractAnalysisDetails = (analysisData) => {
    if (!analysisData) return null;
    
    // Helper function to safely extract string values
    const safeString = (value, defaultValue = 'Unknown') => {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'object') {
        if (value.value !== undefined) return String(value.value);
        if (value.raw_value !== undefined) return String(value.raw_value);
        if (value.name !== undefined) return value.name;
        if (value.description !== undefined) return value.description;
        return JSON.stringify(value);
      }
      return String(value);
    };

    // Helper function to safely extract numeric values
    const safeNumber = (value, defaultValue = 0) => {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'object') {
        if (value.value !== undefined && !isNaN(parseFloat(value.value))) return parseFloat(value.value);
        if (value.raw_value !== undefined && !isNaN(parseFloat(value.raw_value))) return parseFloat(value.raw_value);
        if (value.score !== undefined && !isNaN(parseFloat(value.score))) return parseFloat(value.score);
        if (value.numeric_value !== undefined && !isNaN(parseFloat(value.numeric_value))) return parseFloat(value.numeric_value);
        return defaultValue;
      }
      const num = parseFloat(value);
      return isNaN(num) ? defaultValue : num;
    };

    return {
      age: safeString(analysisData.age || analysisData.estimated_age, 'N/A'),
      gender: safeString(analysisData.gender, 'Unknown'),
      acne: safeNumber(analysisData.acne || analysisData.skin_attributes?.acne, 0),
      darkCircles: safeString(analysisData.dark_circles || analysisData.skin_attributes?.dark_circles, 'Not detected'),
      blackheads: safeString(analysisData.blackheads || analysisData.skin_attributes?.blackheads, 'Not detected'),
      skinTone: safeString(analysisData.skin_tone || analysisData.skin_attributes?.skin_tone, 'Unknown'),
      skinMoisture: safeString(analysisData.skin_moisture || analysisData.skin_attributes?.moisture, 'Unknown'),
      confidence: safeNumber(analysisData.confidence || analysisData.analysis_confidence, 0),
      
      // Raw scores
      rawScores: (() => {
        const scores = analysisData.raw_scores || analysisData.scores || {};
        const processedScores = {};
        
        Object.entries(scores).forEach(([key, value]) => {
          processedScores[key] = safeNumber(value, 0);
        });
        
        return processedScores;
      })()
    };
  };

  const renderSkinGrade = (skinGrade) => {
    if (!skinGrade) return <span className="grade-text">—</span>;
    
    if (typeof skinGrade === 'object') {
      return (
        <div className="skin-grade-object-display">
          <span 
            className="grade-badge-large"
            style={{ 
              backgroundColor: skinGrade.color || getGradeColor(skinGrade.grade),
              color: '#fff'
            }}
          >
            {skinGrade.grade || 'N/A'}
          </span>
          {skinGrade.description && (
            <span className="grade-description">{skinGrade.description}</span>
          )}
          {skinGrade.overall_score !== undefined && (
            <span className="grade-score">
              Score: {typeof skinGrade.overall_score === 'number' 
                ? skinGrade.overall_score.toFixed(1) 
                : skinGrade.overall_score}
            </span>
          )}
        </div>
      );
    }
    
    return (
      <span 
        className="grade-badge-large"
        style={{ backgroundColor: getGradeColor(skinGrade), color: '#fff' }}
      >
        {skinGrade}
      </span>
    );
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (loading) {
    return (
      <AdminPanel>
        <div className="history-minimal-container">
          <div className="minimal-loading">
            <div className="minimal-spinner"></div>
            <p>Loading analysis data...</p>
          </div>
        </div>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel>
      <div className="history-minimal-container">
        {/* Header */}
        <div className="minimal-header">
          <div>
            <h1 className="minimal-title">Analysis History</h1>
            <p className="minimal-subtitle">View and manage skin analysis records</p>
          </div>
          <div className="header-controls">
            <div className="search-box">
              <FiSearch className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by user, grade, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="minimal-search"
              />
            </div>
            <div className="action-buttons">
              <button onClick={fetchAllHistory} className="minimal-btn icon" title="Refresh">
                <FiRefreshCw size={16} />
              </button>
              <button onClick={handleExport} className="minimal-btn primary" title="Export">
                <FiDownload size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="minimal-stats">
          <div className="stat-card">
            <span className="stat-number">{pagination.total}</span>
            <span className="stat-label">Total Analyses</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredHistories.length}</span>
            <span className="stat-label">Filtered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {new Set(histories.map(h => h?.userEmail).filter(Boolean)).size}
            </span>
            <span className="stat-label">Unique Users</span>
          </div>
        </div>

        {/* History Table */}
        <div className="minimal-table-container">
          <div className="table-header-row">
            <h3 className="table-title">Analysis Records</h3>
            <span className="record-count">{sortedHistories.length} records</span>
          </div>
          
          <div className="table-wrapper">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("userEmail")}>
                    <div className="table-head">
                      <FiMail size={12} />
                      <span>User</span>
                      {sortConfig.key === "userEmail" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("skinGrade")}>
                    <div className="table-head">
                      <FiTag size={12} />
                      <span>Grade</span>
                      {sortConfig.key === "skinGrade" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("overallCondition")}>
                    <div className="table-head">
                      <FiActivity size={12} />
                      <span>Condition</span>
                      {sortConfig.key === "overallCondition" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th>
                    <div className="table-head">
                      <FiUser size={12} />
                      <span>Age/Gender</span>
                    </div>
                  </th>
                  <th onClick={() => requestSort("timestamp")}>
                    <div className="table-head">
                      <FiCalendar size={12} />
                      <span>Date</span>
                      {sortConfig.key === "timestamp" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistories.length > 0 ? (
                  sortedHistories.map((history) => {
                    const details = extractAnalysisDetails(history.analysisData);
                    
                    // Handle skinGrade display in table
                    let skinGradeDisplay = 'N/A';
                    let skinGradeColor = '#6B7280';
                    
                    if (history.skinGrade) {
                      if (typeof history.skinGrade === 'object') {
                        skinGradeDisplay = history.skinGrade.grade || 'N/A';
                        skinGradeColor = history.skinGrade.color || getGradeColor(history.skinGrade.grade);
                      } else {
                        skinGradeDisplay = history.skinGrade;
                        skinGradeColor = getGradeColor(history.skinGrade);
                      }
                    }
                    
                    return (
                      <tr key={history._id} className="table-row">
                        <td>
                          <div className="user-info-cell">
                            <span className="user-initials">{getInitials(history.userEmail)}</span>
                            <span className="user-email" title={history.userEmail}>
                              {truncateText(history.userEmail, 20)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="grade-tag"
                            style={{ backgroundColor: skinGradeColor }}
                          >
                            {skinGradeDisplay}
                          </span>
                        </td>
                        <td>
                          <span 
                            className="condition-badge"
                            style={{ color: getConditionColor(history.overallCondition) }}
                          >
                            {history.overallCondition || "—"}
                          </span>
                        </td>
                        <td>
                          <div className="age-gender-cell">
                            <span className="age-value">{renderValue(details?.age)}</span>
                            <span className="gender-value">{renderValue(details?.gender)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <FiCalendar size={12} />
                            <span>{formatDate(history.timestamp)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            <button
                              onClick={() => handleViewDetails(history)}
                              className="action-icon view"
                              title="View Details"
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(history._id)}
                              className="action-icon delete"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-content">
                        <FiFileText size={32} />
                        <h4>No analysis history found</h4>
                        <p>{searchTerm ? "No results match your search" : "Start by analyzing skin images"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Detailed Modal */}
        {showModal && selectedHistory && (
          <div className="minimal-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="minimal-modal detailed-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-header-content">
                  <h3>Complete Analysis Details</h3>
                  <div className="modal-subtext">
                    <span className="modal-user">
                      <FiMail size={12} /> {truncateText(selectedHistory.userEmail, 30)}
                    </span>
                    <span className="modal-date">
                      <FiCalendar size={12} /> {formatDate(selectedHistory.timestamp)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="modal-close">
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="modal-content">
                {(() => {
                  const details = extractAnalysisDetails(selectedHistory.analysisData);
                  
                  if (!details) return <div>No analysis details available</div>;
                  
                  return (
                    <>
                      {/* Summary Cards */}
                      <div className="summary-cards">
                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiTag size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Skin Grade</label>
                            <div className="skin-grade-display">
                              {renderSkinGrade(selectedHistory.skinGrade)}
                            </div>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiActivity size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Overall Condition</label>
                            <span className="condition-main" style={{ color: getConditionColor(selectedHistory.overallCondition) }}>
                              {selectedHistory.overallCondition || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiCpu size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Confidence</label>
                            <span className="confidence-main">
                              {details.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Two Column Layout */}
                      <div className="two-column-layout">
                        {/* Left Column - Image */}
                        <div className="left-column">
                          <div className="modal-section image-section">
                            <h4>Analysis Image</h4>
                            <div className="image-container">
                              {selectedHistory.imageUrl ? (
                                <img 
                                  src={selectedHistory.imageUrl} 
                                  alt="Skin analysis" 
                                  className="analysis-image"
                                />
                              ) : (
                                <div className="image-placeholder">
                                  <span>No image available</span>
                                </div>
                              )}
                              {selectedHistory.imageUrl && (
                                <a 
                                  href={selectedHistory.imageUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="image-external-link"
                                  title="Open full image"
                                >
                                  <FiExternalLink size={16} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Analysis Details */}
                        <div className="right-column">
                          <div className="modal-section">
                            <h4>Basic Information</h4>
                            <div className="info-grid">
                              <div className="info-item">
                                <span className="info-label">Age</span>
                                <span className="info-value">{renderValue(details.age)}</span>
                              </div>
                              <div className="info-item">
                                <span className="info-label">Gender</span>
                                <span className="info-value">{renderValue(details.gender)}</span>
                              </div>
                              <div className="info-item">
                                <span className="info-label">Acne Score</span>
                                <span className="info-value">{renderValue(details.acne)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="modal-section">
                            <h4>Skin Attributes</h4>
                            <div className="attributes-grid">
                              <div className="attribute-item">
                                <span className="attribute-label">Dark Circles</span>
                                <span className="attribute-value">{renderValue(details.darkCircles)}</span>
                              </div>
                              <div className="attribute-item">
                                <span className="attribute-label">Blackheads</span>
                                <span className="attribute-value">{renderValue(details.blackheads)}</span>
                              </div>
                              <div className="attribute-item">
                                <span className="attribute-label">Skin Tone</span>
                                <span className="attribute-value">{renderValue(details.skinTone)}</span>
                              </div>
                              <div className="attribute-item">
                                <span className="attribute-label">Skin Moisture</span>
                                <span className="attribute-value">{renderValue(details.skinMoisture)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Raw Scores */}
                          {Object.keys(details.rawScores).length > 0 && (
                            <div className="modal-section">
                              <h4>Raw Analysis Scores</h4>
                              <div className="scores-container">
                                {Object.entries(details.rawScores).map(([key, value], index) => {
                                  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
                                  const displayValue = typeof value === 'number' ? value.toFixed(3) : String(value);
                                  
                                  return (
                                    <div key={index} className="score-row">
                                      <span className="score-label">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </span>
                                      <div className="score-bar-container">
                                        <div 
                                          className="score-bar" 
                                          style={{ 
                                            width: `${Math.min(numericValue * 100, 100)}%`,
                                            backgroundColor: numericValue > 0.7 ? '#EF4444' : 
                                                           numericValue > 0.4 ? '#F59E0B' : 
                                                           '#10B981'
                                          }}
                                        />
                                        <span className="score-value">
                                          {displayValue}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Full Analysis Data */}
                      <div className="modal-section full-data">
                        <h4>Complete Analysis Data</h4>
                        <pre className="analysis-data-pre">
                          {JSON.stringify(selectedHistory.analysisData, null, 2)}
                        </pre>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPanel>
  );
};

export default History;