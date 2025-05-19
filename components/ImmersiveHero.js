"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSpotify, FaApple, FaYoutube, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
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
  
  // Log latestRelease for debugging
  useEffect(() => {
    if (latestRelease) {
    }
  }, [latestRelease]);

  // Check if the image URL is a valid URL format
  const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // Check if URL starts with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    
    // Additional validation could be added here if needed
    return true;
  };

  useEffect(() => {
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add animation class after component mounts for entrance effect
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

  // Get appropriate image source with validation
  const getImageSrc = () => {
    if (!latestRelease) return '/images/default-cover.jpg';
    
    // Check if image_url exists and is valid
    if (latestRelease.imageUrl && isValidImageUrl(latestRelease.imageUrl)) {
      return latestRelease.imageUrl;
    }
    
    return '/images/default-cover.jpg';
  };

  return (
    <div className="immersive-hero">
      {/* Video Background */}
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
            {/* Fallback to image if video fails */}
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
        
        {/* Overlay gradient */}
        <div className="hero-overlay"></div>
        
        {/* Audio controls */}
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
      
      {/* Hero content */}
      <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
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
        
        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 3;
          color: white;
          opacity: 0.7;
          transition: opacity 0.3s ease;
          animation: fadeIn 2s ease forwards;
        }
        
        .scroll-indicator:hover {
          opacity: 1;
        }
        
        .arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: rotate(45deg) translateY(0);
          }
          40% {
            transform: rotate(45deg) translateY(10px);
          }
          60% {
            transform: rotate(45deg) translateY(5px);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
        
        .fallback-image-container {
          width: 180px;
          height: 180px;
          border-radius: 4px;
          background: linear-gradient(135deg, #333 0%, #111 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .fallback-image {
          font-size: 3.5rem;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
        }
        
        /* Media queries for responsive design */
        @media (max-width: 768px) {
          .artist-name {
            font-size: 3rem;
          }
          
          .artist-tagline {
            font-size: 1.2rem;
          }
          
          .release-content {
            flex-direction: column;
            text-align: center;
          }
          
          .release-artwork {
            margin-bottom: 1rem;
          }
          
          .streaming-links {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ImmersiveHero;
