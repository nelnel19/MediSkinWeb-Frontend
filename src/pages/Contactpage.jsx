import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/contactpage.css";
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiCheckCircle,
  FiFacebook,
  FiInstagram,
  FiGlobe,
  FiMessageSquare
} from "react-icons/fi";
import { 
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineChatAlt2,
  HiOutlineOfficeBuilding
} from "react-icons/hi";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import bgImage from "../assets/bg2.png";

export default function Contactpage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const heroStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="contactpage">
      {/* Navigation */}
      <nav className={`contact-navbar ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'nav-visible' : ''}`}>
        <div className="nav-container">
          <div className="logo">MEDISKIN</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/service" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link active">Contact Us</Link>
          </div>
          <div className="nav-certified">
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="contact-hero" style={heroStyle}>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? "content-visible" : ""}`}>
            <div className="hero-badge animate-badge">
              <FiCheckCircle className="badge-icon" />
              <span>Connect With Us</span>
            </div>
            <h1 className="hero-title animate-title">Contact MediSkin</h1>
            <p className="hero-subtitle animate-subtitle">
              Get in touch with our team for consultations, support, 
              and partnership opportunities. Follow us on social media for updates and skin health tips.
            </p>
            <div className="hero-stats animate-stats">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Active</div>
                <div className="stat-label">Social Community</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Free</div>
                <div className="stat-label">Consultation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-content">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Info Section */}
            <div className="contact-info-main animate-form">
              <div className="section-header animate-on-scroll">
                <span className="section-label">GET IN TOUCH</span>
                <h2 className="section-title">How to Reach Us</h2>
                <p className="section-description">
                  Choose the most convenient way to connect with our team. We're always ready to assist you.
                </p>
              </div>

              <div className="quick-contact-grid">
                <div className="quick-contact-card animate-card card-1">
                  <div className="quick-contact-icon">
                    <FiPhone />
                  </div>
                  <h3>Call Us</h3>
                  <p className="contact-detail">+63 (2) 555-MEDI</p>
                  <p className="contact-detail">+63 912 345 6789</p>
                  <p className="contact-note">Mon-Fri, 9AM-6PM PHT</p>
                </div>

                <div className="quick-contact-card animate-card card-2">
                  <div className="quick-contact-icon">
                    <FiMail />
                  </div>
                  <h3>Email Us</h3>
                  <p className="contact-detail">info@mediskin.com</p>
                  <p className="contact-detail">support@mediskin.com</p>
                  <p className="contact-note">Response within 24 hours</p>
                </div>

                <div className="quick-contact-card animate-card card-3">
                  <div className="quick-contact-icon">
                    <FiMessageSquare />
                  </div>
                  <h3>Live Chat</h3>
                  <p className="contact-detail">Available on website</p>
                  <p className="contact-detail">Click chat button below</p>
                  <p className="contact-note">Instant response</p>
                </div>
              </div>
            </div>

            {/* Contact Info Sidebar - Updated with Social Media */}
            <div className="contact-info-sidebar">
              {/* Social Media Card */}
              <div className="info-card animate-info-card card-1">
                <h3 className="info-title">
                  <FiGlobe className="title-icon" />
                  Connect With Us
                </h3>
                <div className="info-content">
                  <p className="social-description">
                    Follow us on social media for the latest updates, skin health tips, and community discussions.
                  </p>
                  
                  <div className="social-grid">
                    <a href="https://facebook.com/mediskin" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                      <div className="social-icon-wrapper">
                        <FaFacebook className="social-icon" />
                      </div>
                      <div className="social-info">
                        <span className="social-platform">Facebook</span>
                        <span className="social-handle">@mediskin.official</span>
                      </div>
                    </a>

                    <a href="https://instagram.com/mediskin" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      <div className="social-icon-wrapper">
                        <FaInstagram className="social-icon" />
                      </div>
                      <div className="social-info">
                        <span className="social-platform">Instagram</span>
                        <span className="social-handle">@mediskin.ph</span>
                      </div>
                    </a>

                    <a href="https://twitter.com/mediskin" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                      <div className="social-icon-wrapper">
                        <FaTwitter className="social-icon" />
                      </div>
                      <div className="social-info">
                        <span className="social-platform">Twitter</span>
                        <span className="social-handle">@mediskin</span>
                      </div>
                    </a>

                    <a href="https://linkedin.com/company/mediskin" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                      <div className="social-icon-wrapper">
                        <FaLinkedin className="social-icon" />
                      </div>
                      <div className="social-info">
                        <span className="social-platform">LinkedIn</span>
                        <span className="social-handle">MediSkin Inc.</span>
                      </div>
                    </a>
                  </div>

                  <div className="social-stats">
                    <div className="social-stat-item">
                      <span className="stat-value">50K+</span>
                      <span className="stat-label">Facebook Followers</span>
                    </div>
                    <div className="social-stat-item">
                      <span className="stat-value">25K+</span>
                      <span className="stat-label">Instagram Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Contacts Card */}
              <div className="info-card animate-info-card card-2">
                <h3 className="info-title">
                  <HiOutlineMail className="title-icon" />
                  Email Contacts
                </h3>
                <div className="info-content">
                  <div className="email-list">
                    <div className="email-item">
                      <FiMail className="email-icon" />
                      <div>
                        <h4>General Inquiries</h4>
                        <a href="mailto:info@mediskin.com" className="email-address">info@mediskin.com</a>
                      </div>
                    </div>
                    <div className="email-item">
                      <FiMail className="email-icon" />
                      <div>
                        <h4>Technical Support</h4>
                        <a href="mailto:support@mediskin.com" className="email-address">support@mediskin.com</a>
                      </div>
                    </div>
                    <div className="email-item">
                      <FiMail className="email-icon" />
                      <div>
                        <h4>Partnerships</h4>
                        <a href="mailto:partners@mediskin.com" className="email-address">partners@mediskin.com</a>
                      </div>
                    </div>
                    <div className="email-item">
                      <FiMail className="email-icon" />
                      <div>
                        <h4>Feedback</h4>
                        <a href="mailto:feedback@mediskin.com" className="email-address">feedback@mediskin.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Numbers Card */}
              <div className="info-card animate-info-card card-3">
                <h3 className="info-title">
                  <FiPhone className="title-icon" />
                  Contact Numbers
                </h3>
                <div className="info-content">
                  <div className="phone-list">
                    <div className="phone-item">
                      <FiPhone className="phone-icon" />
                      <div>
                        <h4>Landline</h4>
                        <p className="phone-number">+63 (2) 555-MEDI (6334)</p>
                        <span className="phone-note">Mon-Fri, 9AM-6PM</span>
                      </div>
                    </div>
                    <div className="phone-item">
                      <FiPhone className="phone-icon" />
                      <div>
                        <h4>Globe</h4>
                        <p className="phone-number">+63 917 555 1234</p>
                        <span className="phone-note">24/7 Support</span>
                      </div>
                    </div>
                    <div className="phone-item">
                      <FiPhone className="phone-icon" />
                      <div>
                        <h4>Smart</h4>
                        <p className="phone-number">+63 908 555 5678</p>
                        <span className="phone-note">24/7 Support</span>
                      </div>
                    </div>
                    <div className="phone-item">
                      <FiPhone className="phone-icon" />
                      <div>
                        <h4>Sun Cellular</h4>
                        <p className="phone-number">+63 922 555 9012</p>
                        <span className="phone-note">24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Response Card */}
              <div className="info-card animate-info-card card-4">
                <h3 className="info-title">
                  <HiOutlineChatAlt2 className="title-icon" />
                  Quick Response
                </h3>
                <div className="info-content">
                  <div className="response-channels">
                    <div className="response-channel">
                      <div className="response-icon">📱</div>
                      <div>
                        <h4>Messenger</h4>
                        <p>@mediskin.chat</p>
                        <span className="response-time">Response in 5 min</span>
                      </div>
                    </div>
                    <div className="response-channel">
                      <div className="response-icon">💬</div>
                      <div>
                        <h4>Viber</h4>
                        <p>+63 917 555 1234</p>
                        <span className="response-time">Response in 10 min</span>
                      </div>
                    </div>
                    <div className="response-channel">
                      <div className="response-icon">📞</div>
                      <div>
                        <h4>WhatsApp</h4>
                        <p>+63 908 555 5678</p>
                        <span className="response-time">Response in 15 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="emergency-note">
                    <FiCheckCircle className="emergency-icon" />
                    <span>For urgent concerns, please call our 24/7 hotline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}