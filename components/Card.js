import Link from 'next/link';
import Image from 'next/image';
import React from 'react'; // Import React

// Add spotify_link to props
export default function Card({ imageUrl, title, linkUrl, linkText, date, location, children, spotify_link }) {
  // Extract youtube_link from children if passed that way, or expect it as a prop
  // For simplicity, let's assume youtube_link might also be passed as a prop if needed outside children
  // Or modify the music/page.js to pass youtube_link prop directly to Card

  // Find YouTube link within children (less ideal, passing prop is better)
  let youtubeLinkElement = null;
  if (children) {
    const childrenArray = Array.isArray(children) ? children : [children];
    youtubeLinkElement = childrenArray.find(child =>
      child && child.props && child.props.children && child.props.children.props && child.props.children.props.href && child.props.children.props.href.includes('youtu')
    );
  }

  return (
    <div className="card fade-in">
      {imageUrl && (
        <div className="card-image" style={{ maxWidth: '400px' }}>
          <Image
            src={imageUrl}
            alt={title || 'Card image'}
            width={400}
            height={100}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      )}
      <div className="card-content">
        <h3>{title || ''}</h3>
        {date && <p className="text-primary mb-1">{date}</p>}
        {location && <p className="mb-1">{location}</p>}

        {/* Render children that are NOT the YouTube link */}
        {children && (Array.isArray(children) ? children : [children]).filter(child => child !== youtubeLinkElement)}

        {/* Container for Spotify and YouTube buttons */}
        <div className="d-flex flex-column flex-md-row gap-2 mt-3">
          {/* Spotify Button */}
          {spotify_link && (
            <div>
              <a href={spotify_link} target="_blank" rel="noopener noreferrer" className="btn btn-success w-100 w-md-auto">
                Listen on Spotify
              </a>
            </div>
          )}

          {/* YouTube Button (render if found in children or passed as prop) */}
          {youtubeLinkElement && (
            <div>
              {React.cloneElement(youtubeLinkElement, { className: `${youtubeLinkElement.props.className || ''} w-100 w-md-auto` })}
            </div>
          )}
        </div>

        {linkUrl && linkText && (
          <div className="card-actions mt-3">
            <Link href={linkUrl} className="btn" target="_blank" rel="noopener noreferrer">
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
