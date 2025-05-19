"use client"
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import Script from 'next/script';

export default function VideoEmbed({ 
  videoId, 
  platform = 'youtube', 
  title, 
  isStoryEmbed = false, 
  thumbnailOnly = false 
}) {
  // Add state for tracking like status
  const [isLiked, setIsLiked] = useState(false);
  const [instagramScriptLoaded, setInstagramScriptLoaded] = useState(false);
  const { trackVideoInteraction } = useAnalytics();
  
  // Extract Instagram post ID from URL if needed
  const getInstagramId = (url) => {
    if (!url) return null;
    
    // Try to extract the ID from Instagram URL format
    const regex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // If no match found, return the original input (it might already be just the ID)
    return url;
  };
  
  // Effect to process Instagram embeds
  useEffect(() => {
    if (platform === 'instagram' && instagramScriptLoaded) {
      // Trigger Instagram embed processing
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }
  }, [platform, instagramScriptLoaded, videoId]);
  
  // Handler for like/unlike actions
  const handleLike = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    
    // Track like/unlike event
    trackVideoInteraction(
      videoId, 
      newLikeState ? 'like' : 'unlike', 
      platform
    );
  };

  // Track video play when iframe is clicked
  const handleIframeClick = () => {
    trackVideoInteraction(videoId, 'play', platform);
  };

  const renderEmbed = () => {
    // Create reusable like button component
    const likeButton = (
      <button 
        className={`video-like-btn ${isLiked ? 'liked' : ''}`}
        onClick={handleLike}
        style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: isLiked ? '#ff4d4d' : 'rgba(255, 255, 255, 0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
        aria-label={isLiked ? 'Unlike video' : 'Like video'}
      >
        <svg width="20" height="18" viewBox="0 0 20 18" fill={isLiked ? 'white' : '#333'}>
          <path d="M10 17.8l-1.45-1.32C3.4 11.98 0 8.9 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91.81 10 2.09 11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.4-3.4 6.48-8.55 11-1.45 1.32-1.45 1.32-1.45 1.3z"/>
        </svg>
      </button>
    );

    // Handle thumbnail-only mode
    if (thumbnailOnly) {
      switch (platform) {
        case 'youtube':
          // YouTube thumbnail image - use the highest quality
          return (
            <div className="video-embed youtube-thumbnail" style={{ 
              position: 'relative', 
              width: '100%',
              height: '100%',
              background: '#000'
            }}>
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                alt={title || 'YouTube Video'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  // If maxresdefault fails, fall back to hqdefault
                  e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
            </div>
          );
          
        case 'instagram':
          // For Instagram - show a placeholder with the logo
          return (
            <div className="video-embed instagram-thumbnail" style={{ 
              position: 'relative', 
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #FFDC80, #C13584, #833AB4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Instagram Reel
              </div>
            </div>
          );
          
        case 'facebook':
          // For Facebook - show a placeholder
          return (
            <div className="video-embed facebook-thumbnail" style={{ 
              position: 'relative', 
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #18ACFE, #0166E1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Facebook Video
              </div>
            </div>
          );
          
        default:
          return (
            <div className="video-embed default-thumbnail" style={{ 
              position: 'relative', 
              width: '100%',
              height: '100%',
              background: '#222'
            }}></div>
          );
      }
    }

    // Regular embedding code
    switch (platform) {
      case 'youtube':
        // Use the responsive aspect-ratio wrapper
        return (
          <div className="video-embed youtube-embed" style={{ position: 'relative', paddingBottom: '56.25%' /* 16:9 aspect ratio */, height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: 'var(--border-radius)', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || 'YouTube Video'}
              onClick={handleIframeClick}
            ></iframe>
            {likeButton}
          </div>
        );

      case 'facebook':
        // Apply aspect-ratio wrapper technique to Facebook embed as well
        const facebookSrc = `https://www.facebook.com/plugins/video.php?href=${videoId}&show_text=false`;
        return (
          <div className="video-embed facebook-embed" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: 'var(--border-radius)', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
            <iframe
              src={facebookSrc}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={title || 'Facebook Video'}
              onClick={handleIframeClick}
            ></iframe>
            {likeButton}
          </div>
        );

      case 'instagram':
        const instagramId = getInstagramId(videoId);
        
        return (
          <>
            <Script 
              src="//www.instagram.com/embed.js" 
              strategy="lazyOnload"
              onLoad={() => setInstagramScriptLoaded(true)}
            />
            <div className="video-embed instagram-embed" style={{ position: 'relative', width: '100%', maxWidth: '540px', margin: '0 auto', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
              <blockquote 
                className="instagram-media" 
                data-instgrm-permalink={`https://www.instagram.com/reel/${instagramId}/`}
                data-instgrm-version="14" 
                style={{ margin: '0', padding: '0', width: '100%', borderRadius: '3px', overflow: 'hidden', background: '#FFF' }}
              >
                <div style={{ padding: '16px' }}>
                  <a href={`https://www.instagram.com/reel/${instagramId}/`} style={{ color: '#c9c8cd', textDecoration: 'none' }} target="_blank">
                    {title || 'View this post on Instagram'}
                  </a>
                </div>
              </blockquote>
              {likeButton}
            </div>
          </>
        );

      default:
        return <p>Unsupported video platform</p>;
    }
  };

  return renderEmbed();
}
