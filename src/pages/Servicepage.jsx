import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import "../styles/servicepage.css";
import { 
  FiCode, 
  FiShield, 
  FiCloud, 
  FiDatabase, 
  FiTrendingUp, 
  FiSmartphone,
  FiUsers,
  FiCheckCircle
} from "react-icons/fi";
import { 
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineCog
} from "react-icons/hi";
import bgImage from "../assets/bg2.png"; // Import the background image

export default function Servicepage() {
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
    
    // Trigger initial animation
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // Add location to dependency array

  // Inline style for hero section with background image
  const heroStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="servicepage">
      {/* Navigation with animation */}
      <nav className={`service-navbar ${isScrolled ? "scrolled" : ""} ${isVisible ? "nav-visible" : ""}`}>
        <div className="nav-container">
          <div className="logo">MEDISKIN</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/service" className="nav-link active">Services</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </div>
          <div className="nav-certified">
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with background image */}
      <section className="services-hero" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? "content-visible" : ""}`}>
            <div className="hero-badge animate-badge">
              <FiCheckCircle className="badge-icon" />
              <span>Trusted by Thousands</span>
            </div>
            <h1 className="hero-title animate-title">MediSkin Services</h1>
            <p className="hero-subtitle animate-subtitle">
              Comprehensive AI-powered skin analysis solutions designed to help you understand and care for your skin better. 
              Innovative, accessible, and educational technology for everyone.
            </p>
            <div className="hero-stats animate-stats">
              <div className="stat-item">
                <div className="stat-number">AI-Powered</div>
                <div className="stat-label">Technology</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Access</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Educational</div>
                <div className="stat-label">Focus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="main-services">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">OUR SERVICES</span>
            <h2 className="section-title">Skin Analysis Solutions</h2>
            <p className="section-description">
              Advanced AI-powered services designed to help you understand your skin better and make informed decisions.
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card animate-card card-1">
              <div className="service-icon">
                <FiCode className="icon" />
              </div>
              <h3>AI Skin Analysis</h3>
              <p>
                Advanced face scanning technology powered by machine learning algorithms 
                to analyze visible skin features and provide detailed insights.
              </p>
              <ul className="service-features">
                <li><FiCheckCircle className="feature-icon" /> Face scanning technology</li>
                <li><FiCheckCircle className="feature-icon" /> Machine learning analysis</li>
                <li><FiCheckCircle className="feature-icon" /> Detailed skin reports</li>
                <li><FiCheckCircle className="feature-icon" /> Pattern recognition</li>
              </ul>
              <Link to="/services/analysis" className="service-link">Learn more →</Link>
            </div>

            <div className="service-card animate-card card-2">
              <div className="service-icon">
                <FiShield className="icon" />
              </div>
              <h3>Privacy-First Design</h3>
              <p>
                Your data security is our priority. We use end-to-end encryption and never store 
                personal data without your explicit consent.
              </p>
              <ul className="service-features">
                <li><FiCheckCircle className="feature-icon" /> End-to-end encryption</li>
                <li><FiCheckCircle className="feature-icon" /> Anonymous analysis</li>
                <li><FiCheckCircle className="feature-icon" /> Data minimization</li>
                <li><FiCheckCircle className="feature-icon" /> Secure processing</li>
              </ul>
              <Link to="/services/privacy" className="service-link">Learn more →</Link>
            </div>

            <div className="service-card animate-card card-3">
              <div className="service-icon">
                <FiCloud className="icon" />
              </div>
              <h3>Cloud-Based Platform</h3>
              <p>
                Access your skin analysis reports anywhere, anytime through our secure 
                cloud platform with automatic updates and backup.
              </p>
              <ul className="service-features">
                <li><FiCheckCircle className="feature-icon" /> Anywhere access</li>
                <li><FiCheckCircle className="feature-icon" /> Automatic updates</li>
                <li><FiCheckCircle className="feature-icon" /> Secure backup</li>
                <li><FiCheckCircle className="feature-icon" /> Multi-device sync</li>
              </ul>
              <Link to="/services/cloud" className="service-link">Learn more →</Link>
            </div>

            <div className="service-card animate-card card-4">
              <div className="service-icon">
                <FiDatabase className="icon" />
              </div>
              <h3>Skin Health Database</h3>
              <p>
                Access to comprehensive skin health information and educational resources 
                to help you make better skincare decisions.
              </p>
              <ul className="service-features">
                <li><FiCheckCircle className="feature-icon" /> Skin condition database</li>
                <li><FiCheckCircle className="feature-icon" /> Educational resources</li>
                <li><FiCheckCircle className="feature-icon" /> Research-based content</li>
                <li><FiCheckCircle className="feature-icon" /> Regular updates</li>
              </ul>
              <Link to="/services/database" className="service-link">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="specialized-services">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">ADDITIONAL FEATURES</span>
            <h2 className="section-title">Advanced Features</h2>
          </div>
          
          <div className="specialized-grid">
            <div className="specialized-card animate-specialized spec-1">
              <div className="specialized-icon">
                <HiOutlineLightningBolt className="icon" />
              </div>
              <div>
                <h3>Real-Time Analysis</h3>
                <p>
                  Get instant results from our face scanning technology with 
                  processing times under 30 seconds.
                </p>
              </div>
            </div>

            <div className="specialized-card animate-specialized spec-2">
              <div className="specialized-icon">
                <FiTrendingUp className="icon" />
              </div>
              <div>
                <h3>Progress Tracking</h3>
                <p>
                  Monitor changes in your skin over time with detailed 
                  comparison reports and trend analysis.
                </p>
              </div>
            </div>

            <div className="specialized-card animate-specialized spec-3">
              <div className="specialized-icon">
                <HiOutlineChartBar className="icon" />
              </div>
              <div>
                <h3>Detailed Reporting</h3>
                <p>
                  Comprehensive reports with easy-to-understand visualizations 
                  and actionable insights.
                </p>
              </div>
            </div>

            <div className="specialized-card animate-specialized spec-4">
              <div className="specialized-icon">
                <FiSmartphone className="icon" />
              </div>
              <div>
                <h3>Mobile Accessibility</h3>
                <p>
                  Access all features through our mobile app with 
                  responsive design and intuitive interface.
                </p>
              </div>
            </div>

            <div className="specialized-card animate-specialized spec-5">
              <div className="specialized-icon">
                <FiUsers className="icon" />
              </div>
              <div>
                <h3>Educational Community</h3>
                <p>
                  Connect with others on their skin health journey through 
                  our educational community platform.
                </p>
              </div>
            </div>

            <div className="specialized-card animate-specialized spec-6">
              <div className="specialized-icon">
                <HiOutlineCog className="icon" />
              </div>
              <div>
                <h3>Custom Settings</h3>
                <p>
                  Personalize your experience with adjustable settings for 
                  notifications, reports, and analysis depth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">HOW IT WORKS</span>
            <h2 className="section-title">Simple 4-Step Process</h2>
          </div>
          
          <div className="process-timeline">
            <div className="process-step animate-step step-1">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Scan Your Face</h3>
                <p>
                  Use your device's camera to scan your face in proper lighting 
                  conditions for accurate analysis.
                </p>
              </div>
            </div>

            <div className="process-step animate-step step-2">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>
                  Our machine learning algorithms analyze visible skin features 
                  including texture, tone, and visible conditions.
                </p>
              </div>
            </div>

            <div className="process-step animate-step step-3">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Receive Insights</h3>
                <p>
                  Get detailed, easy-to-understand reports with educational 
                  information about your skin's visible features.
                </p>
              </div>
            </div>

            <div className="process-step animate-step step-4">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Learn & Grow</h3>
                <p>
                  Use our educational resources to better understand skin health 
                  and track changes over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}