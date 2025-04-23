'use client';

import { useState, useEffect } from 'react';
import SocialFollow from './SocialFollow';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function StickySocialFollow() {
  const [collapsed, setCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`sticky-social ${collapsed ? 'collapsed' : ''} ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        padding: '0.5rem 0',
        transition: 'right 0.3s ease',
        right: isVisible ? 0 : '-44px',
      }}
    >
      <button 
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand social links" : "Collapse social links"}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {collapsed ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <div style={{
        overflow: 'hidden',
        width: collapsed ? 0 : 'auto',
        opacity: collapsed ? 0 : 1,
        transition: 'width 0.3s ease, opacity 0.3s ease',
      }}>
        <SocialFollow compact={true} vertical={true} />
      </div>
    </div>
  );
}
