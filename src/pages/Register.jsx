import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    birthday: "",
    gender: "prefer not to say"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/register", form);
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registered successfully!");
      console.log(res.data);
      
      // Redirect to login or dashboard
      window.location.href = "/";
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleBirthdayChange = (e) => {
    const birthday = e.target.value;
    setForm({ 
      ...form, 
      birthday: birthday,
      age: birthday ? calculateAge(birthday).toString() : ""
    });
  };

  const openTermsModal = (type) => {
    if (type === 'terms') {
      setModalContent({
        title: 'Terms of Service',
        content: `
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using MediSkin's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          
          <h3>2. Description of Service</h3>
          <p>MediSkin provides AI-powered skin analysis technology for informational and educational purposes only. Our service uses face scanning and machine learning to analyze visible skin features and provide insights.</p>
          
          <h3>3. Medical Disclaimer</h3>
          <p>IMPORTANT: MediSkin is NOT a medical device and does NOT provide medical diagnosis, treatment, or advice. All analysis results are for informational purposes only. Always consult with a qualified healthcare professional for medical concerns.</p>
          
          <h3>4. User Responsibilities</h3>
          <p>Users must provide accurate information and use the service responsibly. You are responsible for maintaining the confidentiality of your account credentials.</p>
          
          <h3>5. Privacy and Data Protection</h3>
          <p>We collect and process personal data as described in our Privacy Policy. By using our service, you consent to such processing.</p>
          
          <h3>6. Intellectual Property</h3>
          <p>All content, features, and functionality of MediSkin are owned by us and protected by intellectual property laws.</p>
          
          <h3>7. Limitation of Liability</h3>
          <p>MediSkin shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
          
          <h3>8. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
          
          <h3>9. Contact Information</h3>
          <p>For questions about these Terms of Service, please contact us at legal@mediskin.com</p>
          
          <p><em>Last updated: March 2026</em></p>
        `
      });
    } else {
      setModalContent({
        title: 'Privacy Policy',
        content: `
          <h3>1. Information We Collect</h3>
          <p>We collect personal information you provide directly, including name, email address, age, gender, and facial scan data for analysis purposes.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>Your information is used to provide skin analysis services, improve our algorithms, communicate with you, and ensure service security.</p>
          
          <h3>3. Data Storage and Security</h3>
          <p>We implement industry-standard security measures to protect your data. All facial scans are processed securely and stored with encryption.</p>
          
          <h3>4. Data Sharing</h3>
          <p>We do not sell your personal data. We may share anonymized data for research purposes or with your explicit consent.</p>
          
          <h3>5. Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@mediskin.com for requests.</p>
          
          <h3>6. Cookies and Tracking</h3>
          <p>We use cookies to enhance user experience and analyze service usage. You can control cookie settings through your browser.</p>
          
          <h3>7. Children's Privacy</h3>
          <p>Our service is not intended for users under 13. We do not knowingly collect data from children.</p>
          
          <h3>8. International Data Transfers</h3>
          <p>Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place.</p>
          
          <h3>9. Policy Updates</h3>
          <p>We may update this policy periodically. Continued use of the service constitutes acceptance of updates.</p>
          
          <p><em>Last updated: March 2026</em></p>
        `
      });
    }
    setShowTermsModal(true);
  };

  const closeModal = () => {
    setShowTermsModal(false);
  };

  // Close modal when clicking outside
  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  };

  return (
    <div className="register-page">
      <div className={`register-container ${isVisible ? 'container-visible' : ''}`}>
        {/* Header with animation */}
        <div className="register-header animate-header">
          <h1 className="logo">Register</h1>
          <h2 className="subtitle">Create your account</h2>
        </div>

        {/* Error Message with animation */}
        {error && (
          <div className="error-alert animate-error">
            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="register-form">
          {/* Name Input */}
          <div className="form-group animate-field field-1">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="form-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group animate-field field-2">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="form-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group animate-field field-3">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="form-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="password-hint">
              Use at least 8 characters with a mix of letters, numbers and symbols
            </div>
          </div>

          {/* Age and Birthday - Two columns */}
          <div className="form-row animate-field field-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Age</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="form-input"
                  min="1"
                  max="120"
                  disabled={loading}
                  readOnly={!!form.birthday}
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Birthday</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleBirthdayChange}
                  className="form-input date-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Gender Select - Full width below */}
          <div className="form-group animate-field field-5">
            <label className="form-label">Gender</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loading}
                style={{ paddingLeft: '44px', appearance: 'none' }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
              <div className="select-arrow">
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="form-options animate-field field-6">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                required
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I agree to the{' '}
                <button 
                  type="button"
                  onClick={() => openTermsModal('terms')}
                  className="terms-link"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button 
                  type="button"
                  onClick={() => openTermsModal('privacy')}
                  className="terms-link"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="divider animate-field field-7">
            <span className="divider-text">---</span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="register-btn animate-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle className="spinner-circle" cx="12" cy="12" r="10" />
                </svg>
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Login Link */}
          <div className="login-section animate-field field-8">
            <p className="login-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Terms and Privacy Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-container animate-modal">
            <div className="modal-header">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-content" dangerouslySetInnerHTML={{ __html: modalContent.content }} />
            <div className="modal-footer">
              <button className="modal-accept-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}