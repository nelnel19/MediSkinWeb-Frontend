import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/adminpanel.css';
import logoImage from '../assets/logo1.png';
import {
  FiUsers,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiMenu,
  FiX,
  FiCalendar,
  FiUserCheck,
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

const Adminpanel = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        
        // Optional: Check if user is actually an admin
        if (parsedUser.role !== 'admin') {
          console.warn('Non-admin user accessing admin panel, redirecting...');
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      // No user data, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard size={20} />, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: <FiUsers size={20} />, path: '/users' },
    { id: 'history', label: 'History', icon: <FiCalendar size={20} />, path: '/history' },
    { id: 'analysis', label: 'Analysis', icon: <FiActivity size={20} />, path: '/analysis' },
    { id: 'insights', label: 'Insights', icon: <FiPieChart size={20} />, path: '/admin/insights' },
    { id: 'verification', label: 'Verification', icon: <FiUserCheck size={20} />, path: '/admin/verification' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    
    // Redirect to login page
    navigate('/login');
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="admin-panel">
      {/* Top Navigation Bar */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="brand">
            <img src={logoImage} alt="MediSkin Logo" className="logo-image" />
          </div>
        </div>

        <div className="navbar-right">
          {userData && (
            <> 
              <div className="user-profile">
                <div className="user-avatar">
                  <span>{getInitials(userData.name)}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{userData.name}</span>
                  <span className="user-role">{userData.email}</span>
                  <div className="user-status">
                    <span className="status-dot active"></span>
                    <span className="status-text">Online</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar for Desktop */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {location.pathname === item.path && (
                <span className="active-indicator"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-sidebar-info">
            {userData && (
              <>
                <div className="sidebar-user-avatar">
                  <span>{getInitials(userData.name)}</span>
                </div>
                <div className="sidebar-user-details">
                  <span className="sidebar-user-name">{userData.name}</span>
                  <span className="sidebar-user-email">{userData.email}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="system-status">
            <div className="status-indicator online"></div>
            <span>System Online</span>
          </div>
          
          {/* Modern Sign Out Button */}
          <div className="logout-section">
            <button 
              className="modern-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
            >
              {sidebarOpen ? 'Sign Out' : '→'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Adminpanel;