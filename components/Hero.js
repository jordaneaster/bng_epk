"use client";

import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaYoutube, FaSpotify, FaApple } from 'react-icons/fa';
import VideoEmbed from './VideoEmbed';
import MusicPlayerEmbed from './MusicPlayerEmbed';
import { supabase } from '../lib/supabaseClient';

const Hero = ({ title, subtitle, bgImage, latestTrack, featuredVideos = [] }) => {
  const [imgSrc, setImgSrc] = useState(bgImage || '/images/hero-bg.jpg');
  const [isMobile, setIsMobile] = useState(false);
  const [albumArtUrl, setAlbumArtUrl] = useState(latestTrack?.imageUrl || null);

  // Fetch album artwork from Supabase if not provided in props
  useEffect(() => {
    const fetchAlbumArtwork = async () => {
      if (!latestTrack?.imageUrl && latestTrack) {
        try {
          // Get the album art from Supabase storage
          const { data, error } = await supabase
            .storage
            .from('album-marketing')
            .getPublicUrl('bng/bape.jpg');
            
          if (error) {
            console.error('Error fetching album artwork:', error);
            return;
          }
          
          if (data?.publicUrl) {
            setAlbumArtUrl(data.publicUrl);
          }
        } catch (error) {
          console.error('Error in fetching album artwork:', error);
        }
      }
    };
    
    fetchAlbumArtwork();
  }, [latestTrack]);

  // Handle responsive layout detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    if (imgSrc !== '/images/hero-bg.jpg') {
      setImgSrc('/images/hero-bg.jpg');
    }
  };

  // Styles for different screen sizes
  const heroSectionStyle = {
    position: 'relative',
    height: 'auto', 
    minHeight: isMobile ? '90vh' : '80vh',
    overflow: 'auto',
    color: '#fff',
    backgroundColor: '#000', // Black background for when 'contain' leaves empty space
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const heroLayoutStyle = {
    position: 'relative',
    zIndex: 1,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    paddingTop: isMobile ? '15vh' : '18vh',
    paddingBottom: isMobile ? '2rem' : '3rem',
    maxWidth: '1400px', // Limit maximum width for very large screens
    margin: '0 auto',
  };

  // Image styles based on device - removed height and width properties
  const imageStyle = {
    objectFit: 'contain',
    filter: 'brightness(0.9)',
    objectPosition: 'top center',
  };

  // Adjusted image container style - this controls the image size
  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: isMobile ? '50vh' : '70vh',
    maxHeight: isMobile ? '70vh' : '90vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#000',
  };

  // Column styles with responsive adjustments
  const leftColumnStyle = {
    width: isMobile ? '100%' : '25%',
    padding: isMobile ? '0 1rem 2rem' : '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    order: isMobile ? 2 : 1, // Reorder for mobile
  };

  const centerColumnStyle = {
    width: isMobile ? '100%' : '50%',
    padding: isMobile ? '0 1rem 2rem' : '0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    order: isMobile ? 1 : 2, // Reorder for mobile - main content first
  };

  const rightColumnStyle = {
    width: isMobile ? '100%' : '25%',
    padding: isMobile ? '0 1rem 2rem' : '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    order: isMobile ? 3 : 3,
  };

  // Card styles - made more transparent
  const cardStyle = {
    background: 'rgba(0,0,0,0.3)', // Reduced opacity from 0.6 to 0.3
    padding: '1.5rem',
    borderRadius: '8px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  };

  // Social icons styles
  const socialIconsStyle = {
    marginTop: isMobile ? '1.5rem' : '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '1.2rem' : '1.5rem',
    fontSize: isMobile ? '1.75rem' : '2rem',
  };

  // Title styles with responsive text sizes
  const titleStyle = {
    fontSize: isMobile ? '2.5rem' : '3.5rem',
    marginBottom: '0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  };

  const subtitleStyle = {
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    maxWidth: '700px',
    margin: '0 auto',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  };

  // Button styles
  const buttonBlockStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '4px',
  };

  return (
    <div className="hero-section" style={heroSectionStyle}>
      <div style={imageContainerStyle}>
        <Image 
          src={imgSrc}
          alt="Hero Background" 
          fill  // This works with the parent's dimensions
          priority
          onError={handleError}
          style={imageStyle}  // No height or width here
          sizes="100vw"
          quality={85}
        />
      </div>
      <div className="hero-layout" style={heroLayoutStyle}>
        {/* Center Column - Main Hero Content */}
        <div className="hero-center" style={centerColumnStyle}>
          <div className="fade-in">
            <h1 style={titleStyle}>{title}</h1>
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          
            <div className="social-icons" style={socialIconsStyle}>
              <Link href="#" aria-label="Instagram"><FaInstagram /></Link>
              <Link href="#" aria-label="Twitter"><FaTwitter /></Link>
              <Link href="#" aria-label="YouTube"><FaYoutube /></Link>
              <Link href="#" aria-label="Spotify"><FaSpotify /></Link>
              <Link href="#" aria-label="Apple Music"><FaApple /></Link>
            </div>
          </div>
        </div>

        {/* Left Column - Latest Release with Music Player */}
        <div className="hero-left" style={leftColumnStyle}>
          <div className="latest-release" style={{...cardStyle, background: 'rgba(0,0,0,0.2)'}}>
            <h3 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Latest Release</h3>
            {latestTrack ? (
              <>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{latestTrack.title}</p>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: '0.9' }}>Out Now</p>

                {/* Album Artwork Image - Using dynamic Supabase URL */}
                {albumArtUrl && (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile ? '180px' : '200px',
                    marginBottom: '1rem',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}>
                    <Image
                      src={albumArtUrl}
                      alt={`${latestTrack.title} Artwork`}
                      fill
                      style={{
                        objectFit: 'contain',
                        borderRadius: '6px'
                      }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                )}

                {/* Apple Music Player - with additional transparent wrapper */}
                {latestTrack.appleEmbedId && (
                  <div style={{ 
                    marginTop: '1rem', 
                    marginBottom: '1rem',
                    background: 'transparent',
                    backdropFilter: 'none'
                  }}>
                    <MusicPlayerEmbed 
                      type="simpleApple" // Using the new simple custom player
                      embedId={latestTrack.appleEmbedId} 
                      title={latestTrack.title} 
                      isMobile={isMobile}  // Pass the isMobile state
                    />
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', // Always column regardless of device
                  gap: '0.75rem',
                  width: '100%'
                }}>
                  {latestTrack.spotifyLink && (
                    <Link 
                      href={latestTrack.spotifyLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm"
                      style={buttonBlockStyle} // Always use block style
                    >
                      Stream On Spotify
                    </Link>
                  )}
                  <Link 
                    href="/music" 
                    className="btn btn-sm"
                    style={buttonBlockStyle} // Always use block style
                  >
                    More Music
                  </Link>
                </div>
              </>
            ) : (
              <p>No releases available</p>
            )}
          </div>
        </div>

        {/* Right Column - Video Embeds */}
        <div className="hero-right" style={rightColumnStyle}>
          <div className="featured-videos" style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Featured Videos</h3>
            {featuredVideos.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* On mobile, only show the first video to save space */}
                {featuredVideos.slice(0, isMobile ? 1 : 2).map((video, index) => (
                  <div key={index} className="video-wrapper" style={{ width: '100%' }}>
                    <VideoEmbed
                      videoId={video.id}
                      platform={video.platform}
                      title={video.title}
                    />
                  </div>
                ))}
                <Link 
                  href="/videos" 
                  className="btn btn-block"
                  style={buttonBlockStyle}
                >
                  {isMobile && featuredVideos.length > 1 ? `+ ${featuredVideos.length - 1} More Videos` : "Watch More"}
                </Link>
              </div>
            ) : (
              <p>No videos available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
