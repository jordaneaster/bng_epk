"use client";
import { useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaSpotify, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function MailingListSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState({
    music: true,
    events: false,
    merch: false
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmailChange = (e) => {
    // Only allow basic email characters to prevent injection attacks
    const sanitizedValue = e.target.value
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s@.-]/g, ''); // Only allow email-valid chars
    setEmail(sanitizedValue);
  };

  const handleNameChange = (e) => {
    // Simple sanitization for name field
    const sanitizedValue = e.target.value
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s'-]/g, ''); // Allow letters, numbers, spaces, apostrophes and hyphens
    setName(sanitizedValue);
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const validateEmail = (email) => {
    // More comprehensive email validation regex
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!email) {
      setStatus('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setStatus('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          name: name.trim(),
          preferences
        }),
        credentials: 'same-origin', // Important for security
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      const data = await response.json();
      
      setEmail('');
      setName('');
      setIsExpanded(false);
      setStatus('Thanks for subscribing! Check your email to confirm.');
    } catch (error) {
      setStatus(error.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mailing-list-subscribe">
      <div className="header-area">
        <h3>Join the Fan Club</h3>
        <p>Get exclusive updates, early access to music and special offers</p>
      </div>

      {status ? (
        <div 
          className={`status-message ${status.includes('Thanks') ? 'status-success' : 'status-error'}`}
          role="alert"
        >
          {status.includes('Thanks') && <FaCheckCircle className="success-icon" />}
          <span>{status}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="subscribe-form">
          {!isExpanded ? (
            <div className="simple-form">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your email"
                  required
                  className="subscribe-input"
                  aria-label="Email address"
                  autoComplete="email"
                />
              </div>
              <div className="button-group">
                <button 
                  type="button" 
                  onClick={() => setIsExpanded(true)}
                  className="subscribe-button secondary"
                >
                  More Options
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="subscribe-button primary"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>
          ) : (
            <div className="expanded-form">
              <div className="form-fields">
                <div className="input-wrapper">
                  <label htmlFor="email">Email*</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    required
                    className="subscribe-input"
                    autoComplete="email"
                  />
                </div>
                
                <div className="input-wrapper">
                  <label htmlFor="name">First Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Your name"
                    className="subscribe-input"
                    autoComplete="given-name"
                  />
                </div>
              </div>
              
              <div className="preferences-section">
                <p className="preference-title">I&apos;m interested in:</p>
                <div className="preferences-grid">
                  <label className={`preference-checkbox ${preferences.music ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={preferences.music}
                      onChange={() => handlePreferenceChange('music')}
                    />
                    <span className="checkbox-text">New Music</span>
                  </label>
                  
                  <label className={`preference-checkbox ${preferences.events ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={preferences.events}
                      onChange={() => handlePreferenceChange('events')}
                    />
                    <span className="checkbox-text">Live Events</span>
                  </label>
                  
                  <label className={`preference-checkbox ${preferences.merch ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={preferences.merch}
                      onChange={() => handlePreferenceChange('merch')}
                    />
                    <span className="checkbox-text">Merchandise</span>
                  </label>
                </div>
              </div>
              
              <div className="button-group expanded">
                <button 
                  type="button" 
                  onClick={() => setIsExpanded(false)}
                  className="subscribe-button secondary"
                >
                  Less Options
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="subscribe-button primary"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
      
      <div className="social-prompt">
        <p>Follow us on:</p>
        <div className="mini-social-links">
          <a href="https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe" target="_blank" rel="noopener noreferrer" className="mini-social-link spotify">
            <FaSpotify />
          </a>
          <a href="https://www.youtube.com/@bngnappsakk" target="_blank" rel="noopener noreferrer" className="mini-social-link youtube">
            <FaYoutube />
          </a>
          <a href="https://instagram.com/bng_nappsakk/" target="_blank" rel="noopener noreferrer" className="mini-social-link instagram">
            <FaInstagram />
          </a>
        </div>
      </div>

      <style jsx>{`
        .mailing-list-subscribe {
          padding: 1.5rem;
          background: rgba(20, 20, 25, 0.6);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 60, 0, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .header-area {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .header-area h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
          color: white;
        }
        
        .header-area p {
          font-size: 0.95rem;
          margin: 0;
          opacity: 0.8;
          line-height: 1.4;
        }
        
        .subscribe-form {
          margin-bottom: 1rem;
        }
        
        .simple-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        
        .subscribe-input {
          width: 100%;
          border: none;
          padding: 0.85rem 1rem;
          padding-left: 2.5rem;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .expanded-form .subscribe-input {
          padding-left: 1rem;
        }
        
        .subscribe-input:focus {
          background: white;
          box-shadow: 0 0 0 2px rgba(255, 60, 0, 0.4);
        }
        
        .button-group {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        
        .button-group.expanded {
          margin-top: 1rem;
          justify-content: space-between;
        }
        
        .subscribe-button {
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        
        .subscribe-button.primary {
          background: #ff3c00;
          color: white;
        }
        
        .subscribe-button.primary:hover:not(:disabled) {
          background: #ff5c30;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 60, 0, 0.3);
        }
        
        .subscribe-button.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .subscribe-button.secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .subscribe-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .expanded-form {
          animation: expandForm 0.3s ease;
        }
        
        .form-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .expanded-form label {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.85rem;
          color: #ddd;
        }
        
        .preferences-section {
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .preference-title {
          font-size: 0.9rem;
          margin: 0 0 0.75rem;
          color: #ddd;
        }
        
        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.5rem;
        }
        
        .preference-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preference-checkbox:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .preference-checkbox.checked {
          background: rgba(255, 60, 0, 0.3);
          border: 1px solid rgba(255, 60, 0, 0.5);
        }
        
        .preference-checkbox input {
          margin: 0;
        }
        
        .checkbox-text {
          font-size: 0.9rem;
        }
        
        .status-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 500;
          animation: fadeIn 0.3s ease;
        }
        
        .status-success {
          background-color: rgba(25, 135, 84, 0.1);
          color: #1db954;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }
        
        .status-error {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }
        
        .success-icon {
          font-size: 1.2rem;
        }
        
        .social-prompt {
          text-align: center;
          margin-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
        }
        
        .social-prompt p {
          font-size: 0.9rem;
          margin: 0 0 0.5rem;
          opacity: 0.7;
        }
        
        .mini-social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .mini-social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #fff;
        }
        
        .mini-social-link:hover {
          transform: translateY(-3px);
        }
        
        .spotify {
          background: #1DB954;
        }
        
        .youtube {
          background: #FF0000;
        }
        
        .instagram {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }
        
        @keyframes expandForm {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (min-width: 768px) {
          .form-fields {
            grid-template-columns: 1fr 1fr;
          }
          
          .simple-form {
            flex-direction: row;
          }
          
          .input-wrapper {
            flex: 1;
          }
        }
        
        @media (max-width: 576px) {
          .button-group {
            flex-direction: column;
          }
          
          .preferences-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
