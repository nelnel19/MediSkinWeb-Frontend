import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/skinanalysis.css";
import AdminPanel from "./Adminpanel"; // Import AdminPanel
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
  FiMail,
  FiTag,
  FiActivity,
  FiCpu
} from "react-icons/fi";

const SkinAnalysis = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
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
  }, []);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/skin-history/all");
      const data = response.data.history || [];
      setHistories(data);
      setPagination({
        page: 1,
        limit: 20,
        total: data.length,
        pages: Math.ceil(data.length / 20)
      });
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredHistories = histories.filter(history => {
    if (!history) return false;
    const searchLower = searchTerm.toLowerCase();
    const userEmail = history.user_id || "";
    const disease = history.prediction?.disease || "";
    const confidence = history.prediction?.confidence?.toString() || "";
    return (
      userEmail.toLowerCase().includes(searchLower) ||
      disease.toLowerCase().includes(searchLower) ||
      confidence.includes(searchLower)
    );
  });

  // Sorting
  const sortedHistories = [...filteredHistories].sort((a, b) => {
    const getValue = (obj, key) => {
      if (key === "user_id") return obj.user_id || "";
      if (key === "disease") return obj.prediction?.disease || "";
      if (key === "confidence") return obj.prediction?.confidence || 0;
      if (key === "created_at") return obj.created_at || "";
      return "";
    };
    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

    if (sortConfig.key === "created_at") {
      try {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      } catch {
        return 0;
      }
    }

    if (sortConfig.key === "confidence") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "#10B981";
    if (confidence >= 60) return "#3B82F6";
    if (confidence >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      try {
        await API.delete(`/api/skin-history/${id}`);
        fetchAllHistory();
      } catch (err) {
        console.error("Error deleting history:", err);
      }
    }
  };

  const handleViewDetails = (history) => {
    setSelectedHistory(history);
    setShowModal(true);
  };

  const handleExport = () => {
    const headers = ["User Email", "Disease", "Confidence", "Date"];
    const csv = sortedHistories.map(history => {
      const userEmail = history.user_id || "";
      const disease = history.prediction?.disease || "";
      const confidence = history.prediction?.confidence || 0;
      const date = formatDate(history.created_at);
      return [userEmail, disease, confidence, date]
        .map(field => `"${field}"`)
        .join(",");
    }).join("\n");

    const blob = new Blob([`${headers.join(",")}\n${csv}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skin_analysis_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getInitials = (email) => {
    if (!email) return "??";
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <AdminPanel>
        <div className="skin-analysis-container">
          <div className="minimal-loading">
            <div className="minimal-spinner"></div>
            <p>Loading analysis history...</p>
          </div>
        </div>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel>
      <div className="skin-analysis-container">
        {/* Header */}
        <div className="minimal-header">
          <div>
            <h1 className="minimal-title">Skin Analysis History</h1>
            <p className="minimal-subtitle">View all analyzed skin conditions</p>
          </div>
          <div className="header-controls">
            <div className="search-box">
              <FiSearch className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search by user, disease, confidence..."
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
            <span className="stat-number">{histories.length}</span>
            <span className="stat-label">Total Analyses</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredHistories.length}</span>
            <span className="stat-label">Filtered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {new Set(histories.map(h => h?.user_id).filter(Boolean)).size}
            </span>
            <span className="stat-label">Unique Users</span>
          </div>
        </div>

        {/* Table */}
        <div className="minimal-table-container">
          <div className="table-header-row">
            <h3 className="table-title">Analysis Records</h3>
            <span className="record-count">{sortedHistories.length} records</span>
          </div>

          <div className="table-wrapper">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("user_id")}>
                    <div className="table-head">
                      <FiMail size={12} />
                      <span>User</span>
                      {sortConfig.key === "user_id" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("disease")}>
                    <div className="table-head">
                      <FiTag size={12} />
                      <span>Disease</span>
                      {sortConfig.key === "disease" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("confidence")}>
                    <div className="table-head">
                      <FiActivity size={12} />
                      <span>Confidence</span>
                      {sortConfig.key === "confidence" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("created_at")}>
                    <div className="table-head">
                      <FiCalendar size={12} />
                      <span>Date</span>
                      {sortConfig.key === "created_at" && (
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
                    const disease = history.prediction?.disease || "Unknown";
                    const confidence = history.prediction?.confidence || 0;
                    return (
                      <tr key={history._id} className="table-row">
                        <td>
                          <div className="user-info-cell">
                            <span className="user-initials">{getInitials(history.user_id)}</span>
                            <span className="user-email" title={history.user_id}>
                              {truncateText(history.user_id, 20)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="disease-tag">{disease}</span>
                        </td>
                        <td>
                          <span
                            className="confidence-tag"
                            style={{ backgroundColor: getConfidenceColor(confidence) }}
                          >
                            {confidence}%
                          </span>
                        </td>
                        <td>
                          <div className="date-cell">
                            <FiCalendar size={12} />
                            <span>{formatDate(history.created_at)}</span>
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
                    <td colSpan="5" className="empty-state">
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

        {/* Modal for details */}
        {showModal && selectedHistory && (
          <div className="minimal-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="minimal-modal detailed-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-content">
                  <h3>Complete Analysis Details</h3>
                  <div className="modal-subtext">
                    <span className="modal-user">
                      <FiMail size={12} /> {truncateText(selectedHistory.user_id, 30)}
                    </span>
                    <span className="modal-date">
                      <FiCalendar size={12} /> {formatDate(selectedHistory.created_at)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="modal-close">
                  <FiX size={20} />
                </button>
              </div>

              <div className="modal-content">
                {(() => {
                  const prediction = selectedHistory.prediction || {};
                  return (
                    <>
                      {/* Summary Cards */}
                      <div className="summary-cards">
                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiTag size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Disease</label>
                            <span className="grade-main">{prediction.disease || "Unknown"}</span>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiActivity size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Confidence</label>
                            <span className="confidence-main">{prediction.confidence || 0}%</span>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon">
                            <FiCpu size={20} />
                          </div>
                          <div className="summary-info">
                            <label>Analysis ID</label>
                            <span className="id-code">{selectedHistory._id?.substring(0, 8)}</span>
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
                              {selectedHistory.image_url ? (
                                <img
                                  src={selectedHistory.image_url}
                                  alt="Skin analysis"
                                  className="analysis-image"
                                />
                              ) : (
                                <div className="image-placeholder">
                                  <span>No image available</span>
                                </div>
                              )}
                              {selectedHistory.image_url && (
                                <a
                                  href={selectedHistory.image_url}
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

                        {/* Right Column - Details */}
                        <div className="right-column">
                          <div className="modal-section">
                            <h4>Description</h4>
                            <p className="disease-description">{prediction.description || "No description available."}</p>
                          </div>

                          {prediction.medication_info?.has_medications && (
                            <div className="modal-section">
                              <h4>Recommended Treatments</h4>
                              <ul className="treatment-list">
                                {prediction.medication_info.medications.map((med, idx) => (
                                  <li key={idx}>
                                    <strong>{med.category}</strong>: {med.items.join(", ")}
                                    <p>{med.description}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {prediction.medication_info?.general_advice?.length > 0 && (
                            <div className="modal-section">
                              <h4>General Advice</h4>
                              <ul className="advice-list">
                                {prediction.medication_info.general_advice.map((adv, idx) => (
                                  <li key={idx}>{adv}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Full JSON Data */}
                      <div className="modal-section full-data">
                        <h4>Complete Analysis Data</h4>
                        <pre className="analysis-data-pre">
                          {JSON.stringify(prediction, null, 2)}
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

export default SkinAnalysis;