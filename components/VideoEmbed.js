export default function VideoEmbed({ videoId, platform = 'youtube', title }) {
  // Note: For Facebook, videoId should be the FULL URL-encoded video page URL.
  // Example: encodeURIComponent('https://www.facebook.com/yourpage/videos/1234567890/')

  const renderEmbed = () => {
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
            ></iframe>
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
            ></iframe>
          </div>
        );
      default:
        return <p>Unsupported video platform</p>;
    }
  };

  return renderEmbed();
}
