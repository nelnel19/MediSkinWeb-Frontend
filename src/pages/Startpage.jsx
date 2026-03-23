import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import { FaChartLine, FaShieldAlt, FaUsers, FaCheckCircle, FaChevronRight, FaBriefcase } from "react-icons/fa";
import { HiOutlineChartSquareBar, HiOutlineClock } from "react-icons/hi";
import "../styles/startpage.css";
import bgImage from "../assets/bg2.png";
import logoImage from "../assets/logo1.png"; // Import your logo image

export default function Startpage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation(); // Add useLocation hook

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll
    });
    
    // Trigger animation after component mounts
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // Add location to dependency array

  // Inline style for hero section
  const heroStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="startpage">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isVisible ? "nav-visible" : ""}`}>
        <div className="nav-container">
          <div className="logo">MEDISKIN</div>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/service" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </div>
          <div className="nav-certified">
            <Link to="/login" className="login-link">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with inline style */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? "content-visible" : ""}`}>            
            {/* Logo Image with white background container */}
            <div className="logo-container animate-logo">
              <div className="logo-background">
                <img 
                  src={logoImage} 
                  alt="MediSkin Logo" 
                  className="main-logo"
                />
              </div>
            </div>
            
            {/* Subtitle with background */}
            <div className="subtitle-container animate-subtitle">
              <p className="hero-subtitle">
                Transform your skin health journey with our comprehensive AI-powered analysis. 
                We deliver cutting-edge technology combined with proven methodologies 
                to help you understand and care for your skin better.
              </p>
            </div>
            
            {/* CTA Button with enhanced styling */}
            <div className="cta-container animate-cta">
              <Link to="/register" className="btn btn-primary">
                Get Started <FaChevronRight className="btn-icon" />
              </Link>
            </div>
            
            {/* Stats Section with enhanced backgrounds */}
            <div className="stats-container animate-stats">
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaChartLine className="stat-icon-svg" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">AI</div>
                    <div className="stat-label">Powered Analysis</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <HiOutlineClock className="stat-icon-svg" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">Real-Time</div>
                    <div className="stat-label">Results</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <FaShieldAlt className="stat-icon-svg" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">Secure</div>
                    <div className="stat-label">Processing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`hero-image animate-dashboard ${isVisible ? "dashboard-visible" : ""}`}>
          <div className="image-placeholder">
            <div className="image-content">
              <div className="floating-element floating-1">
                <HiOutlineChartSquareBar className="floating-icon" />
              </div>
              <div className="floating-element floating-2">
                <FaUsers className="floating-icon" />
              </div>
              <div className="floating-element floating-3">
                <FaShieldAlt className="floating-icon" />
              </div>
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <div className="dashboard-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="dashboard-title">
                    <FaChartLine className="dashboard-icon" />
                    Skin Analysis Dashboard
                  </div>
                </div>
                <div className="dashboard-grid">
                  <div className="grid-item">
                    <div className="grid-header">
                      <FaChartLine className="grid-icon" />
                      Skin Health Score
                    </div>
                    <div className="grid-chart"></div>
                  </div>
                  <div className="grid-item">
                    <div className="grid-header">
                      <FaUsers className="grid-icon" />
                      Daily Analysis
                    </div>
                    <div className="grid-chart"></div>
                  </div>
                  <div className="grid-item">
                    <div className="grid-header">
                      <FaShieldAlt className="grid-icon" />
                      Privacy Status
                    </div>
                    <div className="grid-chart"></div>
                  </div>
                  <div className="grid-item">
                    <div className="grid-header">
                      <HiOutlineClock className="grid-icon" />
                      Progress Tracking
                    </div>
                    <div className="grid-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated for skin analysis */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title animate-on-scroll">MediSkin Features</h2>
          <p className="section-description animate-on-scroll">
            Comprehensive solutions designed for better skin health understanding
          </p>
          <div className="features-grid">
            <div className="feature-card animate-card card-1">
              <div className="feature-icon">
                <FaChartLine className="icon" />
              </div>
              <h3 className="feature-title">AI-Powered Analysis</h3>
              <p className="feature-description">
                Advanced machine learning algorithms analyze visible skin features for accurate, real-time insights.
              </p>
              <div className="feature-features">
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Real-time analysis</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Pattern recognition</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Detailed reports</span>
                </div>
              </div>
            </div>
            <div className="feature-card animate-card card-2">
              <div className="feature-icon">
                <FaShieldAlt className="icon" />
              </div>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-description">
                Your data security is our priority with end-to-end encryption and anonymous processing.
              </p>
              <div className="feature-features">
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Anonymous analysis</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Secure processing</span>
                </div>
              </div>
            </div>
            <div className="feature-card animate-card card-3">
              <div className="feature-icon">
                <FaBriefcase className="icon" />
              </div>
              <h3 className="feature-title">Educational Resources</h3>
              <p className="feature-description">
                Comprehensive skin health information and educational content to help you make better decisions.
              </p>
              <div className="feature-features">
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Skin health database</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Educational content</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Progress tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}