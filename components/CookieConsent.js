'use client';

import { useState, useEffect } from 'react';
import { GA_TRACKING_ID } from '@/lib/gtag';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowConsent(true);
    } else if (hasConsented === 'accepted' && GA_TRACKING_ID) {
      // Enable analytics if user previously consented
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    
    // Enable analytics
    if (GA_TRACKING_ID && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };
  
  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
    
    // Disable analytics
    if (GA_TRACKING_ID && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };
  
  // Prevent click events from bubbling up to the document
  const handleConsentClick = (e) => {
    e.stopPropagation();
  };
  
  if (!showConsent) return null;
  
  return (
    <div 
      className="cookie-consent-banner" 
      onClick={handleConsentClick}
      onMouseDown={handleConsentClick}
      onTouchStart={handleConsentClick}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '1rem',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div className="cookie-content" style={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <p style={{ margin: 0, textAlign: 'center' }}>
        This website uses cookies to enhance your experience, analyze site usage, and provide personalized content. By clicking &quot;Accept All,&quot; you consent to the use of all cookies.
        </p>
        <div className="cookie-buttons" style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <button 
            onClick={acceptCookies} 
            className="accept-btn"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Accept
          </button>
          <button 
            onClick={declineCookies} 
            className="decline-btn"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
