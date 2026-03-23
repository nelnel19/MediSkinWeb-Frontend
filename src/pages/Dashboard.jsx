import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiUserPlus, 
  FiBarChart2,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiPieChart,
  FiDatabase,
  FiCalendar
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import AdminPanel from "./Adminpanel";
import API from "../api/axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayRegistrations: 0,
    totalAnalyses: 0,
    loading: true,
    error: null
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [growthRate, setGrowthRate] = useState(0);
  const [weeklyNewUsers, setWeeklyNewUsers] = useState(0);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fallback function for generating demo data
  const generateDemoWeeklyData = (totalUsers, todayRegistrations) => {
    const today = new Date();
    const data = [];
    let cumulativeUsers = Math.floor(totalUsers * 0.8); // Start with 80% of total users

    let totalNewUsers = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate realistic growth pattern
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dailyGrowth = isWeekend ? 
        Math.floor(Math.random() * 3) + 1 : 
        Math.floor(Math.random() * 6) + 2;
      
      cumulativeUsers += dailyGrowth;
      totalNewUsers += dailyGrowth;
      
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newUsers: dailyGrowth,
        cumulativeUsers: cumulativeUsers
      });
    }
    
    setWeeklyNewUsers(totalNewUsers);
    
    // Calculate growth rate
    if (data.length >= 2) {
      const first = data[0].cumulativeUsers;
      const last = data[data.length - 1].cumulativeUsers;
      const rate = ((last - first) / first) * 100;
      setGrowthRate(parseFloat(rate.toFixed(1)));
    }
    
    return data;
  };

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch users data
      const usersResponse = await API.get("/auth/all");
      
      if (usersResponse.data.success) {
        const users = usersResponse.data.users;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayUsers = users.filter(user => {
          const userDate = new Date(user.createdAt);
          userDate.setHours(0, 0, 0, 0);
          return userDate.getTime() === today.getTime();
        });

        // Fetch analysis history count
        const historyResponse = await API.get("/api/history/all/histories", {
          params: { limit: 1, page: 1 }
        });

        let totalAnalyses = 0;
        if (historyResponse.data.success) {
          totalAnalyses = historyResponse.data.pagination.total || 0;
        }

        // TRY TO FETCH REAL WEEKLY DATA
        let weeklyChartData = [];
        let realWeeklyNewUsers = 0;
        let realGrowthRate = 0;
        let usingDemoData = false;
        
        try {
          const weeklyResponse = await API.get("/auth/weekly-stats");
          
          if (weeklyResponse.data.success) {
            weeklyChartData = weeklyResponse.data.data;
            
            // Calculate weekly new users
            realWeeklyNewUsers = weeklyChartData.reduce((sum, day) => sum + day.newUsers, 0);
            
            // Calculate growth rate (comparing start vs end of week)
            if (weeklyChartData.length >= 2) {
              const firstDay = weeklyChartData[0];
              const lastDay = weeklyChartData[weeklyChartData.length - 1];
              
              if (firstDay.cumulativeUsers > 0) {
                const growth = lastDay.cumulativeUsers - firstDay.cumulativeUsers;
                realGrowthRate = (growth / firstDay.cumulativeUsers) * 100;
              }
            }
            
            setWeeklyNewUsers(realWeeklyNewUsers);
            setGrowthRate(parseFloat(realGrowthRate.toFixed(1)));
            setIsDemoData(false);
          } else {
            throw new Error("Weekly stats API returned unsuccessful");
          }
        } catch (weeklyError) {
          console.warn("Using demo data for weekly stats:", weeklyError);
          // Fallback to demo data
          weeklyChartData = generateDemoWeeklyData(users.length, todayUsers.length);
          usingDemoData = true;
          setIsDemoData(true);
        }

        setStats({
          totalUsers: users.length,
          todayRegistrations: todayUsers.length,
          totalAnalyses: totalAnalyses,
          loading: false,
          error: null
        });

        setWeeklyData(weeklyChartData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load dashboard statistics"
      }));
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-value">
            <span className="tooltip-label">Total Users:</span>
            <span className="tooltip-number">{payload[0]?.value?.toLocaleString() || 0}</span>
          </p>
          <p className="tooltip-value">
            <span className="tooltip-label">New Users:</span>
            <span className="tooltip-number">{payload[1]?.value || 0}</span>
          </p>
          {isDemoData && (
            <p className="tooltip-demo">Demo data - using realistic pattern</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (stats.loading) {
    return (
      <AdminPanel>
        <div className="dashboard-scoped-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard statistics...</p>
          </div>
        </div>
      </AdminPanel>
    );
  }

  if (stats.error) {
    return (
      <AdminPanel>
        <div className="dashboard-scoped-container">
          <div className="alert alert-error">
            <p>{stats.error}</p>
            <button onClick={fetchDashboardData} className="alert-action">
              Retry
            </button>
          </div>
        </div>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel>
      <div className="dashboard-scoped-container">
        {/* Header - Matches Users component exactly */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchDashboardData} className="icon-btn refresh-btn">
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {stats.error && (
          <div className="alert alert-error">
            <p>{stats.error}</p>
            <button onClick={fetchDashboardData} className="alert-action">
              Retry
            </button>
          </div>
        )}

        {/* Demo Data Notice */}
        {isDemoData && (
          <div className="alert alert-info">
            <p>Weekly chart shows demo data. Real data will appear once users have registered.</p>
          </div>
        )}

        {/* Stats Grid - Exact same style as Users component */}
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">
              <FiUsers size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalUsers.toLocaleString()}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FiUserPlus size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.todayRegistrations}</span>
              <span className="stat-label">New Today</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FiDatabase size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalAnalyses.toLocaleString()}</span>
              <span className="stat-label">Total Analyses</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FiActivity size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">
                {stats.totalUsers > 0 
                  ? (stats.totalAnalyses / stats.totalUsers).toFixed(1)
                  : '0.0'}
              </span>
              <span className="stat-label">Analyses per User</span>
            </div>
          </div>
        </div>

        {/* Growth Chart Section */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">Weekly User Growth</h2>
            <div className="section-subtitle">
              <span className={`growth-indicator ${growthRate > 0 ? 'positive' : growthRate < 0 ? 'negative' : 'neutral'}`}>
                {growthRate > 0 ? <FiTrendingUp size={14} /> : growthRate < 0 ? <FiTrendingDown size={14} /> : <FiActivity size={14} />}
                {growthRate >= 0 ? '+' : ''}{growthRate}% this week
              </span>
              {isDemoData && (
                <span className="demo-badge">Demo</span>
              )}
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#f0f0f0" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#2d3748', strokeWidth: 1 }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                  />
                  {/* Main line with flowing wave animation */}
                  <Line
                    type="monotone"
                    dataKey="cumulativeUsers"
                    name="Total Users"
                    stroke="#2d3748"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, stroke: '#2d3748', strokeWidth: 2 }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                    connectNulls={true}
                  />
                  {/* Animated gradient overlay for wave effect */}
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2d3748" stopOpacity="1">
                        <animate
                          attributeName="stop-color"
                          values="#2d3748; #4a5568; #2d3748"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="50%" stopColor="#4a5568" stopOpacity="1">
                        <animate
                          attributeName="stop-color"
                          values="#4a5568; #718096; #4a5568"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="100%" stopColor="#2d3748" stopOpacity="1">
                        <animate
                          attributeName="stop-color"
                          values="#2d3748; #4a5568; #2d3748"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </stop>
                    </linearGradient>
                    
                    {/* Animated dash pattern for wave motion */}
                    <linearGradient id="dashPattern" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2d3748" stopOpacity="0" />
                      <stop offset="30%" stopColor="#2d3748" stopOpacity="1" />
                      <stop offset="70%" stopColor="#2d3748" stopOpacity="1" />
                      <stop offset="100%" stopColor="#2d3748" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* New users line */}
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#00a854"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ stroke: '#00a854', strokeWidth: 1.5, r: 3 }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                    animationBegin={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Animated wave overlay */}
            <div className="wave-overlay">
              <div className="wave-line"></div>
            </div>
          </div>
          
          <div className="chart-summary">
            <div className="summary-item">
              <span className="summary-label">Weekly New Users</span>
              <span className="summary-value">{weeklyNewUsers}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Today's New Users</span>
              <span className="summary-value">{stats.todayRegistrations}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Users</span>
              <span className="summary-value">{stats.totalUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">Performance Metrics</h2>
            <div className="section-subtitle">
              Key performance indicators
            </div>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <FiPieChart size={16} />
                </div>
                <span className="metric-title">User Growth</span>
              </div>
              <div className="metric-body">
                <span className="metric-main">
                  {growthRate >= 0 ? '+' : ''}{growthRate}%
                </span>
                <span className="metric-sub">Weekly change</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <FiCalendar size={16} />
                </div>
                <span className="metric-title">Activity Rate</span>
              </div>
              <div className="metric-body">
                <span className="metric-main">
                  {stats.totalUsers > 0 
                    ? ((stats.totalAnalyses / stats.totalUsers) * 100).toFixed(0)
                    : '0'}%
                </span>
                <span className="metric-sub">Analysis engagement</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <FiBarChart2 size={16} />
                </div>
                <span className="metric-title">Daily Engagement</span>
              </div>
              <div className="metric-body">
                <span className="metric-main">
                  {stats.todayRegistrations}
                </span>
                <span className="metric-sub">New users today</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <FiActivity size={16} />
                </div>
                <span className="metric-title">Daily Average</span>
              </div>
              <div className="metric-body">
                <span className="metric-main">
                  {weeklyNewUsers > 0 ? Math.round(weeklyNewUsers / 7) : 0}
                </span>
                <span className="metric-sub">Avg. daily users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPanel>
  );
};

export default Dashboard;