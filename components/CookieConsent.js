'use client';

import { useState, useEffect } from 'react';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { FB_PIXEL_ID, updateConsentStatus } from '@/lib/metaPixel';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // Safely check for existing consent
    try {
      // Check if user has already consented
      const hasConsented = localStorage.getItem('cookieConsent');
      if (!hasConsented) {
        setShowConsent(true);
      } else if (hasConsented === 'accepted') {
        // Enable analytics if user previously consented
        if (GA_TRACKING_ID && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted'
          });
        }
        
        // Enable Meta Pixel if user previously consented
        if (FB_PIXEL_ID && window.fbq) {
          updateConsentStatus(true);
        }
      }
    } catch (e) {
      console.warn('Error accessing localStorage for consent check:', e);
      // Show consent banner if we can't determine consent status
      setShowConsent(true);
    }
  }, []);
  
  const acceptCookies = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted');
      setShowConsent(false);
      
      // Enable analytics
      if (GA_TRACKING_ID && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      
      // Enable Meta Pixel
      if (FB_PIXEL_ID && window.fbq) {
        updateConsentStatus(true);
      }
    } catch (e) {
      console.error('Error saving consent:', e);
      // Close banner anyway to avoid blocking the UI
      setShowConsent(false);
    }
  };
  
  const declineCookies = () => {
    try {
      localStorage.setItem('cookieConsent', 'declined');
      setShowConsent(false);
      
      // Disable analytics
      if (GA_TRACKING_ID && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
      
      // Disable Meta Pixel
      if (FB_PIXEL_ID && window.fbq) {
        updateConsentStatus(false);
      }
    } catch (e) {
      console.error('Error saving consent rejection:', e);
      // Close banner anyway
      setShowConsent(false);
    }
  };
  
  // Prevent click events from bubbling up to the document
  const handleConsentClick = (e) => {
    e.stopPropagation();
  };
  
  // Don't render anything during SSR
  if (!isClient) return null;
  
  // Don't show if consent has been given
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
        This website uses cookies to enhance your experience, analyze site usage, and provide personalized content and advertisements. By clicking &quot;Accept All,&quot; you consent to the use of all cookies including those for analytics and personalized advertising.
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
