"use client"
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function VideoEmbed({ videoId, platform = 'youtube', title }) {
  // Add state for tracking like status
  const [isLiked, setIsLiked] = useState(false);
  const { trackVideoInteraction } = useAnalytics();
  
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

    switch (platform) {
      case 'youtube':
        // Use the responsive aspect-ratio wrapper
        return (
          <div className="video-embed youtube-embed" style={{ position: 'relative', paddingBottom: '56.25%' /* 16:9 aspect ratio */, height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: 'var(--border-radius)', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              // Use absolute positioning to fill the wrapper
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
        // Note: Facebook plugin might still have limitations. Remove fixed width from src.
        const facebookSrc = `https://www.facebook.com/plugins/video.php?href=${videoId}&show_text=false`; // Removed width parameter
        return (
          // Use aspect-ratio wrapper (adjust padding-bottom if FB videos have a different common ratio)
          <div className="video-embed facebook-embed" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: 'var(--border-radius)', marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
            <iframe
              src={facebookSrc}
              // Remove fixed width/height attributes
              // Use absolute positioning to fill the wrapper
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
      default:
        return <p>Unsupported video platform</p>;
    }
  };

  return renderEmbed();
}
