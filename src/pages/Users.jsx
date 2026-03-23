import React, { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/users.css";
import AdminPanel from "./Adminpanel";
import { 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiCopy,
  FiRefreshCw,
  FiDownload,
  FiChevronUp,
  FiChevronDown,
  FiHash,
  FiFilter
} from "react-icons/fi";
import { HiOutlineCake } from "react-icons/hi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/auth/all");
      const usersData = response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      if (err.response?.status === 404) {
        setError("Users endpoint not found. Please create the backend endpoint.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const safeString = (str) => {
    if (str === null || str === undefined) return "";
    return String(str);
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      safeString(user.name).toLowerCase().includes(searchLower) ||
      safeString(user.email).toLowerCase().includes(searchLower) ||
      safeString(user._id).toLowerCase().includes(searchLower)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a && a[sortConfig.key];
    const bValue = b && b[sortConfig.key];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;
    
    if (sortConfig.key === "name" || sortConfig.key === "email") {
      const aStr = safeString(aValue).toLowerCase();
      const bStr = safeString(bValue).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    } else if (sortConfig.key === "createdAt" || sortConfig.key === "birthday") {
      try {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      } catch {
        return 0;
      }
    } else {
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
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
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "—";
    try {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return "—";
    }
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Age", "Birthday", "Registered"];
    const csv = sortedUsers.map(user => 
      `${user?.name || "Unknown"},${user?.email || ""},${calculateAge(user?.birthday) || "—"},${formatDate(user?.birthday) || "—"},${formatDate(user?.createdAt) || "—"}`
    ).join('\n');
    const blob = new Blob([`${headers.join(',')}\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminPanel>
        <div className="users-scoped-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel>
      <div className="users-scoped-container">
        {/* Compact Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">Manage user accounts and data</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchUsers} className="icon-btn refresh-btn">
              <FiRefreshCw size={16} />
            </button>
            <button onClick={handleExport} className="icon-btn export-btn">
              <FiDownload size={16} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
            <button onClick={fetchUsers} className="alert-action">
              Retry
            </button>
          </div>
        )}

        {/* Compact Stats */}
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">
              <FiUser size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <FiFilter size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{filteredUsers.length}</span>
              <span className="stat-label">Filtered</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </div>
          <div className="sort-info">
            <span className="sort-label">
              Sorted by: <strong>{sortConfig.key}</strong>
              <span className={`sort-direction ${sortConfig.direction}`}>
                {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
              </span>
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-wrapper">
          <div className="table-header">
            <span className="table-count">
              {sortedUsers.length} of {users.length} users
            </span>
          </div>
          
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("name")}>
                    <div className="table-header-cell">
                      <FiUser size={14} />
                      <span>User</span>
                      {sortConfig.key === "name" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("email")}>
                    <div className="table-header-cell">
                      <FiMail size={14} />
                      <span>Email</span>
                      {sortConfig.key === "email" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("birthday")}>
                    <div className="table-header-cell">
                      <HiOutlineCake size={14} />
                      <span>Age</span>
                      {sortConfig.key === "birthday" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => requestSort("createdAt")}>
                    <div className="table-header-cell">
                      <FiCalendar size={14} />
                      <span>Registered</span>
                      {sortConfig.key === "createdAt" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th>
                    <div className="table-header-cell">
                      <FiHash size={14} />
                      <span>ID</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <tr key={user?._id} className="table-row">
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user?.profileImage?.url ? (
                              <>
                                <img
                                  src={user.profileImage.url}
                                  alt={user.name || "User"}
                                  className="avatar-image"
                                  onError={handleImageError}
                                />
                                <div className="avatar-fallback" style={{ display: 'none' }}>
                                  {getInitial(user.name)}
                                </div>
                              </>
                            ) : (
                              <div className="avatar-fallback">
                                {getInitial(user?.name)}
                              </div>
                            )}
                          </div>
                          <div className="user-info">
                            <span className="user-name">{user?.name || "Unknown User"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${user?.email}`} className="email-link">
                          <FiMail size={12} />
                          <span>{user?.email || "—"}</span>
                        </a>
                      </td>
                      <td>
                        <div className="age-cell">
                          <span className="age-value">{user?.birthday ? calculateAge(user.birthday) : "—"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span>{formatDate(user?.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="id-cell">
                          <code className="user-id">
                            {user?._id ? `${user._id.substring(0, 8)}` : "—"}
                          </code>
                          {user?._id && (
                            <button
                              onClick={() => navigator.clipboard.writeText(user._id)}
                              className="copy-btn"
                              title="Copy ID"
                            >
                              <FiCopy size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div className="empty-content">
                        <FiUser size={32} />
                        <h4>No users found</h4>
                        <p>{searchTerm ? "Try adjusting your search" : "No users available"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Compact Footer */}
          {sortedUsers.length > 0 && (
            <div className="table-footer">
              <div className="footer-info">
                Showing <strong>{sortedUsers.length}</strong> users
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPanel>
  );
};

export default Users;