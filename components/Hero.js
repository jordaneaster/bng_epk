"use client";

import React from 'react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaYoutube, FaSpotify, FaApple, FaTimes, FaHandPointRight } from 'react-icons/fa';
import VideoEmbed from './VideoEmbed';
import MusicPlayerEmbed from './MusicPlayerEmbed';
import { supabase } from '../lib/supabaseClient';
import { trackClickEvent } from '../lib/gtag'; // Import the GA tracking function

const Hero = ({ title, subtitle, bgImage, featuredVideos = [] }) => {
  const [imgSrc, setImgSrc] = useState(bgImage || '/images/hero-bg.jpg');
  const [isMobile, setIsMobile] = useState(false);
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTrack, setOverlayTrack] = useState(null);
  const overlayRef = useRef(null);

  // The current track to display
  const currentTrack = featuredTracks[currentTrackIndex] || null;

  // Fetch all featured tracks from the database
  useEffect(() => {
    const fetchFeaturedTracks = async () => {
      try {
        setLoading(true);
        // Query all tracks where featured is true
        const { data, error } = await supabase
          .from('bng_music')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching featured tracks:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Process each track to get its album artwork
          const tracksWithArtwork = await Promise.all(
            data.map(async (track) => {
              if (track.image_url) {
                // Check if image_url is already a full URL
                if (track.image_url.startsWith('http')) {
                  // If it's already a full URL, use it directly
                  return {
                    ...track,
                    imageUrl: track.image_url
                  };
                } else {
                  // If it's a relative path, get the public URL
                  const { data: imageData, error: imageError } = await supabase
                    .storage
                    .from('album-marketing')
                    .getPublicUrl(track.image_url);
                    
                  if (imageError) {
                    console.error('Error fetching album artwork:', imageError);
                    return track;
                  }
                  
                  return {
                    ...track,
                    imageUrl: imageData.publicUrl
                  };
                }
              }
              return track;
            })
          );
          
          setFeaturedTracks(tracksWithArtwork);
          
          // Check if any track has overlay set to true
          const overlayTrack = tracksWithArtwork.find(track => track.overlay === true);
          if (overlayTrack) {
            setOverlayTrack(overlayTrack);
            setShowOverlay(true);
          }
        }
      } catch (error) {
        console.error('Error in fetching featured tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedTracks();
  }, []);

  // Handle click outside of overlay to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is from the cookie consent banner
      const consentBanner = document.querySelector('.cookie-consent-banner');
      if (consentBanner && (consentBanner === event.target || consentBanner.contains(event.target))) {
        // If the click originated from the consent banner, don't close the overlay
        return;
      }

      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showOverlay]);

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

  // Function to cycle to the next featured track
  const nextTrack = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === featuredTracks.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to cycle to the previous featured track
  const prevTrack = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === 0 ? featuredTracks.length - 1 : prevIndex - 1
    );
  };

  // Styles for different screen sizes
  const heroSectionStyle = {
    position: 'relative',
    height: 'auto', 
    minHeight: isMobile ? '90vh' : '80vh',
    overflow: 'auto',
    color: '#fff',
    backgroundColor: '#000',
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
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const imageStyle = {
    objectFit: 'contain',
    filter: 'brightness(0.9)',
    objectPosition: 'top center',
  };

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

  const leftColumnStyle = {
    width: isMobile ? '100%' : '25%',
    padding: isMobile ? '0 1rem 2rem' : '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    order: isMobile ? 2 : 1,
  };

  const centerColumnStyle = {
    width: isMobile ? '100%' : '50%',
    padding: isMobile ? '0 1rem 2rem' : '0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    order: isMobile ? 1 : 2,
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

  const cardStyle = {
    background: 'rgba(0,0,0,0.3)',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  };

  const socialIconsStyle = {
    marginTop: isMobile ? '1.5rem' : '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '1.2rem' : '1.5rem',
    fontSize: isMobile ? '1.75rem' : '2rem',
  };

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

  const buttonBlockStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '4px',
  };

  const navButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    color: 'white',
    cursor: 'pointer',
    margin: '0 5px',
    fontSize: '0.8rem'
  };

  const trackNavigationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '0.5rem'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: showOverlay ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const overlayContentStyle = {
    backgroundColor: '#121212',
    width: isMobile ? '90%' : '500px',
    maxWidth: '500px',
    borderRadius: '10px',
    padding: '30px',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.5s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer'
  };

  const overlayImageStyle = {
    width: '70%',
    height: 'auto',
    marginBottom: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    objectFit: 'contain',
    margin: '0 auto',
    display: 'block'
  };

  const overlayButtonsContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    position: 'relative',
    marginTop: '20px',
    padding: '0 30px'
  };

  const overlayButtonStyle = {
    padding: '10px 15px',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    width: isMobile ? '100%' : 'auto',
    transition: 'transform 0.3s ease'
  };

  const pointerStyle = {
    position: 'absolute',
    left: '0px',
    top: '50%',
    transform: 'translateY(-50%)',
    animation: 'pointRight 1s infinite alternate',
    fontSize: '1.8rem',
    color: '#FFF',
    display: isMobile ? 'none' : 'block'
  };

  return (
    <>
      {/* Overlay */}
      {overlayTrack && (
        <div style={overlayStyle}>
          <div ref={overlayRef} style={overlayContentStyle}>
            <button 
              onClick={() => setShowOverlay(false)}
              style={closeButtonStyle}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            
            <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>New Release!</h2>
            <h3 style={{ marginBottom: '25px', textAlign: 'center' }}>{overlayTrack.title}</h3>
            
            {overlayTrack.imageUrl && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Image 
                  src={overlayTrack.imageUrl}
                  alt={`${overlayTrack.title} Album Art`}
                  width={300}
                  height={300}
                  style={overlayImageStyle}
                />
              </div>
            )}
            
            <p style={{ marginBottom: '15px', textAlign: 'center' }}>Listen now on your favorite platform!</p>
            
            <div style={overlayButtonsContainerStyle}>
              <FaHandPointRight style={pointerStyle} />
              
              {overlayTrack.spotify_link && (
                <Link 
                  href={overlayTrack.spotify_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClickEvent('music_overlay_click', {
                    platform: 'spotify',
                    track_title: overlayTrack.title,
                    track_id: overlayTrack.id
                  })}
                  style={{
                    ...overlayButtonStyle,
                    backgroundColor: '#1DB954'
                  }}
                >
                  <FaSpotify /> Spotify
                </Link>
              )}
              
              {overlayTrack.apple_music_link && (
                <Link 
                  href={overlayTrack.apple_music_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClickEvent('music_overlay_click', {
                    platform: 'apple_music',
                    track_title: overlayTrack.title,
                    track_id: overlayTrack.id
                  })}
                  style={{
                    ...overlayButtonStyle,
                    backgroundColor: '#FB233B'
                  }}
                >
                  <FaApple /> Apple Music
                </Link>
              )}
              
              {overlayTrack.youtube_link && (
                <Link 
                  href={overlayTrack.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClickEvent('music_overlay_click', {
                    platform: 'youtube',
                    track_title: overlayTrack.title,
                    track_id: overlayTrack.id
                  })}
                  style={{
                    ...overlayButtonStyle,
                    backgroundColor: '#FF0000'
                  }}
                >
                  <FaYoutube /> YouTube
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="hero-section" style={heroSectionStyle}>
        <div style={imageContainerStyle}>
          <Image 
            src={imgSrc}
            alt="Hero Background" 
            fill
            priority
            onError={handleError}
            style={imageStyle}
            sizes="100vw"
            quality={85}
          />
        </div>
        <div className="hero-layout" style={heroLayoutStyle}>
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

          <div className="hero-left" style={leftColumnStyle}>
            <div className="latest-release" style={{...cardStyle, background: 'rgba(0,0,0,0.2)'}}>
              <h3 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.3rem' : '1.5rem' }}>
                Featured {featuredTracks.length > 1 ? 'Releases' : 'Release'}
              </h3>
              
              {loading ? (
                <p>Loading featured tracks...</p>
              ) : featuredTracks.length > 0 && currentTrack ? (
                <>
                  {featuredTracks.length > 1 && (
                    <div style={trackNavigationStyle}>
                      <button onClick={prevTrack} style={navButtonStyle}>Previous</button>
                      <span style={{ margin: '0 10px' }}>
                        {currentTrackIndex + 1} / {featuredTracks.length}
                      </span>
                      <button onClick={nextTrack} style={navButtonStyle}>Next</button>
                    </div>
                  )}

                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{currentTrack.title}</p>
                  <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: '0.9' }}>Out Now</p>

                  {currentTrack.imageUrl && (
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
                        src={currentTrack.imageUrl}
                        alt={`${currentTrack.title} Artwork`}
                        fill
                        style={{
                          objectFit: 'contain',
                          borderRadius: '6px'
                        }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  )}

                  {currentTrack.apple_embed_id && (
                    <div style={{ 
                      marginTop: '1rem', 
                      marginBottom: '1rem',
                      background: 'transparent',
                      backdropFilter: 'none'
                    }}>
                      <MusicPlayerEmbed 
                        type="simpleApple"
                        embedId={currentTrack.apple_embed_id} 
                        title={currentTrack.title} 
                        isMobile={isMobile}
                      />
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.75rem',
                    width: '100%'
                  }}>
                    {currentTrack.spotify_link && (
                      <Link 
                        href={currentTrack.spotify_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm"
                        style={buttonBlockStyle}
                      >
                        Stream On Spotify
                      </Link>
                    )}
                    <Link 
                      href="/music" 
                      className="btn btn-sm"
                      style={buttonBlockStyle}
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

          <div className="hero-right" style={rightColumnStyle}>
            <div className="featured-videos" style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Featured Videos</h3>
              {featuredVideos.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
    </>
  );
};

export default Hero;
