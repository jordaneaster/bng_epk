'use client';

import Link from 'next/link';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function TrackableLink({
  href,
  children,
  eventName,
  eventParams = {},
  className = '',
  target = '',
  rel = '',
  ...props
}) {
  const { event } = useAnalytics();

  const handleClick = (e) => {
    if (eventName) {
      event(eventName, eventParams);
    }
    
    // If it's an external link opening in a new tab, we don't need to prevent default
    if (target !== '_blank' && props.onClick) {
      e.preventDefault();
      setTimeout(() => {
        window.location.href = href;
      }, 150); // Small delay to ensure event is tracked
    }
  };

  // Determine if this is an external link
  const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
  
  // Set rel attribute for external links
  const relationship = isExternal ? `${rel} noopener noreferrer`.trim() : rel;

  return isExternal ? (
    <a
      href={href}
      className={className}
      target={target}
      rel={relationship}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  ) : (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
