import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/aboutpage.css";
import bgImage from "../assets/bg2.png";
// Import team member images
import teamMember1 from "../assets/nel1.jpg";
import teamMember2 from "../assets/hannah.jpg";
import teamMember3 from "../assets/crish.jpg";
import teamMember4 from "../assets/esti.jpg";

export default function Aboutpage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

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
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Inline style for hero section with background image
  const heroStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="aboutpage">
      {/* Navigation with animation */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isVisible ? "nav-visible" : ""}`}>
        <div className="nav-container">
          <div className="logo">MEDISKIN</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link active">About Us</Link>
            <Link to="/service" className="nav-link">Services</Link>
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
      <section className="about-hero" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? "content-visible" : ""}`}>
            <div className="hero-badge animate-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="badge-icon">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>ISO 9001 Certified</span>
            </div>
            <h1 className="hero-title animate-title">About MediSkin</h1>
            <p className="hero-subtitle animate-subtitle">
              Leading innovation in skin analysis solutions since 2024. We deliver accessible, user-friendly technology that helps people understand their skin better through AI-powered analysis.
            </p>
            <div className="hero-stats animate-stats">
              <div className="stat-item">
                <div className="stat-number">Innovative</div>
                <div className="stat-label">AI Technology</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">User-Friendly</div>
                <div className="stat-label">Easy to Use</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Educational</div>
                <div className="stat-label">Skin Awareness</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="about-content">
        {/* Mission & Vision */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <div className="section-header animate-on-scroll">
                <span className="section-label">OUR PURPOSE</span>
                <h2 className="section-title">Mission & Vision</h2>
              </div>
              <div className="mission-grid">
                <div className="mission-card animate-card card-1">
                  <div className="mission-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V12L15 15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Our Mission</h3>
                  <p>
                    MediSkin's mission is to develop an accessible and user-friendly system that uses face scanning and machine learning to analyze visible skin features and provide informative, easy-to-understand insights. The system is designed to promote skin awareness and education, helping users make better skincare decisions while clearly emphasizing that all results are for informational purposes only and not for medical use.
                  </p>
                </div>
                <div className="mission-card animate-card card-2">
                  <div className="mission-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8L19 12L15 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 8L5 12L9 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Our Vision</h3>
                  <p>
                    MediSkin aims to empower users with a clearer understanding of their skin through smart face scanning and machine learning. It provides informative insights on visible skin conditions and predictive analysis for awareness only, not for medical diagnosis or treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="values-section">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <span className="section-label">OUR FOUNDATION</span>
              <h2 className="section-title">Core Values</h2>
            </div>
            <div className="values-grid">
              <div className="value-card animate-value value-1">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Accuracy</h3>
                <p>
                  We use advanced machine learning algorithms to provide the most accurate skin analysis possible within our scope of informational insights.
                </p>
              </div>
              <div className="value-card animate-value value-2">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12L12 8L8 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Innovation</h3>
                <p>
                  Continuously advancing our technology to deliver cutting-edge skin analysis solutions that help people understand their skin better.
                </p>
              </div>
              <div className="value-card animate-value value-3">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Transparency</h3>
                <p>
                  Building trust through clear communication about the capabilities and limitations of our technology for informational purposes only.
                </p>
              </div>
              <div className="value-card animate-value value-4">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Accessibility</h3>
                <p>
                  Making skin analysis technology available and understandable to everyone, regardless of their technical expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="leadership-section">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <span className="section-label">LEADERSHIP</span>
              <h2 className="section-title">Our Team</h2>
            </div>
            <div className="leadership-grid">
              {/* Team Member 1 */}
              <div className="leader-card animate-leader leader-1">
                <div className="leader-image">
                  <div className="image-frame">
                    <img 
                      src={teamMember1} 
                      alt="Arnel Bullo" 
                      className="leader-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120/3b82f6/ffffff?text=AJ";
                      }}
                    />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Arnel Bullo</h3>
                  <p className="leader-title">AI Research Lead</p>
                  <p className="leader-bio">
                    10+ years in machine learning and computer vision. PhD in Computer Science specializing in image analysis.
                  </p>
                  <div className="leader-links">
                    <span className="linkedin-link">LinkedIn</span>
                    <span className="email-link">alex@mediskin.com</span>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="leader-card animate-leader leader-2">
                <div className="leader-image">
                  <div className="image-frame">
                    <img 
                      src={teamMember2} 
                      alt="Hannah Maejoy Bernolia" 
                      className="leader-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120/10b981/ffffff?text=HB";
                      }}
                    />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Hannah Maejoy Bernolia</h3>
                  <p className="leader-title">Dermatology Consultant</p>
                  <p className="leader-bio">
                    Board-certified dermatologist with 15 years of clinical experience. Advises on skin analysis parameters.
                  </p>
                  <div className="leader-links">
                    <span className="linkedin-link">LinkedIn</span>
                    <span className="email-link">hannah@mediskin.com</span>
                  </div>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="leader-card animate-leader leader-3">
                <div className="leader-image">
                  <div className="image-frame">
                    <img 
                      src={teamMember3} 
                      alt="Crisha Arlene Antonio" 
                      className="leader-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120/8b5cf6/ffffff?text=CA";
                      }}
                    />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Crisha Arlene Antonio</h3>
                  <p className="leader-title">Product Design Lead</p>
                  <p className="leader-bio">
                    Former UX Lead at Google. Focuses on creating intuitive, accessible interfaces for complex technology.
                  </p>
                  <div className="leader-links">
                    <span className="linkedin-link">LinkedIn</span>
                    <span className="email-link">crisha@mediskin.com</span>
                  </div>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="leader-card animate-leader leader-4">
                <div className="leader-image">
                  <div className="image-frame">
                    <img 
                      src={teamMember4} 
                      alt="Jeremiah Estillore" 
                      className="leader-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120/f59e0b/ffffff?text=JE";
                      }}
                    />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Jeremiah Estillore</h3>
                  <p className="leader-title">Clinical Research Director</p>
                  <p className="leader-bio">
                    PhD in Biomedical Engineering with focus on skin health technology. Leads our clinical validation studies.
                  </p>
                  <div className="leader-links">
                    <span className="linkedin-link">LinkedIn</span>
                    <span className="email-link">jeremiah@mediskin.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}