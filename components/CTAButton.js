"use client";

import Link from 'next/link';
import { FaPlay, FaTicketAlt, FaCalendarAlt, FaDownload, FaSpotify, FaApple } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { event as trackEvent } from '@/lib/gtag';

export default function CTAButton({ 
  type = 'stream', 
  text, 
  url, 
  fullWidth = false,
  trackingId,
  icon = true,
  className = '',
  newTab = true,
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'stream': return <FaPlay />;
      case 'spotify': return <FaSpotify />;
      case 'apple': return <FaApple />;
      case 'ticket': return <FaTicketAlt />;
      case 'event': return <FaCalendarAlt />;
      case 'download': return <FaDownload />;
      default: return <FaPlay />;
    }
  };

  const getText = () => {
    if (text) return text;
    
    switch (type) {
      case 'stream': return 'Stream Now';
      case 'spotify': return 'Listen on Spotify';
      case 'apple': return 'Listen on Apple Music';
      case 'ticket': return 'Get Tickets';
      case 'event': return 'View Events';
      case 'download': return 'Download';
      default: return 'Learn More';
    }
  };

  const handleClick = () => {
    if (trackingId) {
      trackEvent({
        action: 'click',
        category: 'cta',
        label: trackingId,
      });
    }
  };
  
  if (!mounted) return null;

  const btnClass = `cta-button ${type}-cta ${fullWidth ? 'full-width' : ''} ${className}`;
  
  return (
    <Link 
      href={url} 
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : ""}
      onClick={handleClick}
      className={btnClass}
    >
      {icon && <span className="cta-icon">{getIcon()}</span>}
      <span className="cta-text">{getText()}</span>
    </Link>
  );
}
