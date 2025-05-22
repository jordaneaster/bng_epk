"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSpotify, FaApple, FaYoutube, FaVolumeUp, FaVolumeMute, FaArrowRight, FaLock } from 'react-icons/fa';
import { trackClickEvent } from '../lib/gtag';

const ImmersiveHero = ({ 
  artistName, 
  tagline, 
  videoUrl = "/videos/hero-background.mp4",
  fallbackImageUrl = "/images/hero-bg.jpg",
  latestRelease 
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (latestRelease) {
    }
  }, [latestRelease]);

  const isValidImageUrl = (url) => {
    if (!url) return false;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleStreamingClick = (platform) => {
    if (!latestRelease) return;
    
    trackClickEvent('hero_streaming_click', {
      platform,
      track: latestRelease.title,
    });
  };

  const getImageSrc = () => {
    if (!latestRelease) return '/images/default-cover.jpg';
    
    if (latestRelease.imageUrl && isValidImageUrl(latestRelease.imageUrl)) {
      return latestRelease.imageUrl;
    }
    
    return '/images/default-cover.jpg';
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSubscribeStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSubscribeStatus('success');
        setEmail('');
        trackClickEvent('hero_subscribe', { 
          action: 'subscribe_success'
        });
      } else {
        const error = await response.json();
        setSubscribeStatus('error');
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
        trackClickEvent('hero_subscribe', { 
          action: 'subscribe_error',
          error: error.message
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
      setErrorMessage('Network error. Please try again.');
      trackClickEvent('hero_subscribe', { 
        action: 'subscribe_error',
        error: 'network_error'
      });
    }
  };

  const handleCtaClick = (ctaType) => {
    trackClickEvent('hero_cta_click', { 
      cta_type: ctaType
    });
  };

  return (
    <div className="immersive-hero">
      <div className="hero-background">
        {!isVideoError ? (
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="hero-video"
            onError={() => setIsVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            <Image 
              src={fallbackImageUrl} 
              alt={artistName} 
              fill 
              sizes="100vw"
              style={{ objectFit: 'cover' }} 
              priority 
            />
          </video>
        ) : (
          <Image 
            src={fallbackImageUrl} 
            alt={artistName} 
            fill 
            sizes="100vw"
            style={{ objectFit: 'cover' }} 
            priority 
          />
        )}
        
        <div className="hero-overlay"></div>
        
        {!isVideoError && (
          <button 
            onClick={toggleMute} 
            className="mute-toggle"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
        )}
      </div>
      
      <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
        <div className="content-columns">
          <div className="left-column">
            <div className="artist-info">
              <h1 className="artist-name">{artistName}</h1>
              <p className="artist-tagline">{tagline}</p>
            </div>
            
            {latestRelease && (
              <div className="latest-release">
                <div className="release-content">
                  <div className="release-artwork">
                    {imageError ? (
                      <div className="fallback-image-container">
                        <div className="fallback-image">
                          {latestRelease.title?.charAt(0) || '?'}
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={getImageSrc()}
                        alt={latestRelease.title || 'Latest Release'} 
                        width={180} 
                        height={180}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                  
                  <div className="release-info">
                    <span className="latest-label">Latest Drop</span>
                    <h2 className="release-title">{latestRelease.title}</h2>
                    
                    <div className="streaming-links">
                      {latestRelease.spotify_link && (
                        <Link 
                          href={latestRelease.spotify_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleStreamingClick('spotify')}
                          className="streaming-link spotify"
                        >
                          <FaSpotify /> <span>Spotify</span>
                        </Link>
                      )}
                      {latestRelease.apple_music_link && (
                        <Link 
                          href={latestRelease.apple_music_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleStreamingClick('apple')}
                          className="streaming-link apple"
                        >
                          <FaApple /> <span>Apple Music</span>
                        </Link>
                      )}
                      {latestRelease.youtube_link && (
                        <Link 
                          href={latestRelease.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleStreamingClick('youtube')}
                          className="streaming-link youtube"
                        >
                          <FaYoutube /> <span>YouTube</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="cta-container">
              <Link 
                href="/music" 
                className="main-cta-button"
                onClick={() => handleCtaClick('explore_music')}
              >
                Explore Full Discography
                <FaArrowRight className="cta-icon" />
              </Link>
              
              <Link 
                href="/contact" 
                className="secondary-cta-button"
                onClick={() => handleCtaClick('booking_inquiries')}
              >
                Booking Inquiries
              </Link>
            </div>
          </div>
          
          <div className="right-column">
            <div className="subscribe-container">
              <div className="subscribe-content">
                <div className="subscribe-header">
                  <FaLock className="lock-icon" />
                  <h3>Get Exclusive Content</h3>
                </div>
                <p>Subscribe for early access to new releases, behind-the-scenes content, and VIP event invitations.</p>
                
                <form onSubmit={handleSubscribe} className="subscribe-form">
                  <div className="form-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      aria-label="Email for newsletter"
                      disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                      className={errorMessage ? 'error' : ''}
                    />
                    <button 
                      type="submit" 
                      disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                      className={`subscribe-btn ${subscribeStatus === 'loading' ? 'loading' : ''} ${subscribeStatus === 'success' ? 'success' : ''}`}
                    >
                      {subscribeStatus === 'loading' ? 'Subscribing...' : 
                       subscribeStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
                    </button>
                  </div>
                  
                  {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                  )}
                  
                  {subscribeStatus === 'success' && (
                    <div className="success-message">Thank you! Check your email for confirmation.</div>
                  )}
                </form>
                
                <p className="privacy-notice">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .immersive-hero {
          position: relative;
          height: 100vh;
          width: 100%;
          color: #fff;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.85) 100%);
          z-index: 1;
          pointer-events: none;
        }
        
        .mute-toggle {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 2;
          background: rgba(0,0,0,0.5);
          border: none;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background 0.3s ease;
        }
        
        .mute-toggle:hover {
          background: rgba(0,0,0,0.8);
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .hero-content.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .content-columns {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          gap: 3rem;
          width: 100%;
        }
        
        .left-column {
          flex: 1;
          max-width: 650px;
        }
        
        .right-column {
          flex: 0 0 350px;
          display: flex;
          align-items: center;
        }
        
        .artist-info {
          margin-bottom: 2rem;
        }
        
        .artist-name {
          font-size: 5rem;
          font-weight: 900;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -1px;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.8);
          line-height: 1;
          background-image: linear-gradient(to right, #fff, #aaa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .artist-tagline {
          font-size: 1.5rem;
          margin-top: 1rem;
          text-shadow: 1px 1px 5px rgba(0,0,0,1);
          max-width: 600px;
          opacity: 0.9;
        }
        
        .latest-release {
          margin-top: 1rem;
          width: 100%;
          max-width: 600px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 1.5rem;
        }
        
        .release-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .latest-label {
          display: inline-block;
          background: #ff3c00;
          color: white;
          font-weight: bold;
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .release-title {
          font-size: 1.8rem;
          margin: 0.5rem 0 1rem;
          font-weight: bold;
          line-height: 1.2;
        }
        
        .streaming-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .streaming-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          color: white;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }
        
        .streaming-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .spotify {
          background: #1db954;
        }
        
        .apple {
          background: #fb233b;
        }
        
        .youtube {
          background: #ff0000;
        }
        
        .cta-container {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .main-cta-button {
          background: #ff3c00;
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 60, 0, 0.3);
        }
        
        .main-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 60, 0, 0.4);
        }
        
        .cta-icon {
          transition: transform 0.2s ease;
        }
        
        .main-cta-button:hover .cta-icon {
          transform: translateX(4px);
        }
        
        .secondary-cta-button {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(5px);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 500;
          font-size: 1.1rem;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        
        .secondary-cta-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }
        
        .subscribe-container {
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .subscribe-content {
          padding: 2rem;
        }
        
        .subscribe-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .lock-icon {
          color: #ff3c00;
          font-size: 1.2rem;
        }
        
        .subscribe-header h3 {
          font-size: 1.5rem;
          margin: 0;
          color: white;
        }
        
        .subscribe-container p {
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        
        .subscribe-form {
          margin-bottom: 1rem;
        }
        
        .form-group {
          display: flex;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .subscribe-form input {
          flex: 1;
          min-width: 0;
          padding: 0.8rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          color: white;
          font-size: 1rem;
        }
        
        .subscribe-form input:focus {
          outline: none;
          border-color: #ff3c00;
        }
        
        .subscribe-form input.error {
          border-color: #ff3333;
        }
        
        .subscribe-btn {
          padding: 0 1.5rem;
          background: #ff3c00;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
          white-space: normal;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .subscribe-btn:hover {
          background: #ff5c33;
        }
        
        .subscribe-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }
        
        .subscribe-btn.loading {
          background: #666;
        }
        
        .subscribe-btn.success {
          background: #4BB543;
        }
        
        .error-message {
          color: #ff3333;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .success-message {
          color: #4BB543;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .privacy-notice {
          font-size: 0.8rem;
          opacity: 0.7;
          margin-top: 1rem;
          text-align: center;
        }
        
        @media (max-width: 992px) {
          .content-columns {
            flex-direction: column;
            gap: 2rem;
          }
          
          .right-column {
            width: 100%;
            max-width: 600px;
          }
          
          .artist-name {
            font-size: 4rem;
          }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            padding: 1.5rem;
            justify-content: flex-start;
            padding-top: 7rem;
            overflow-y: auto;
          }
          
          .subscribe-content {
            padding: 1.5rem;
          }
          
          .subscribe-header h3 {
            font-size: 1.3rem;
          }
          
          .form-group {
            flex-direction: column;
          }
          
          .subscribe-form input {
            width: 100%;
            border-radius: 4px;
          }
          
          .subscribe-btn {
            width: 100%;
            border-radius: 4px;
            padding: 0.75rem;
          }
        }
        
        @media (max-width: 400px) {
          .hero-content {
            padding: 1rem;
            padding-top: 5rem;
          }
          
          .artist-name {
            font-size: 2.5rem;
          }
          
          .artist-tagline {
            font-size: 1rem;
          }
          
          .subscribe-content {
            padding: 1.25rem;
          }
          
          .subscribe-header h3 {
            font-size: 1.2rem;
          }
          
          .subscribe-container p {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          
          .subscribe-btn {
            font-size: 0.95rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ImmersiveHero;
