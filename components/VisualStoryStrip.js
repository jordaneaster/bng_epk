"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const VisualStoryStrip = ({ storyItems = [] }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check visibility and screen size
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Update arrow visibility based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Scroll methods
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // If no content is provided
  if (!storyItems || storyItems.length === 0) {
    storyItems = [
      {
        id: 1,
        type: 'image',
        src: '/images/story-1.jpg',
        alt: 'In the studio',
        title: 'Studio Session',
        description: 'Working on the next big hit',
        link: '/videos'
      },
      {
        id: 2,
        type: 'image',
        src: '/images/story-2.jpg',
        alt: 'Backstage moments',
        title: 'Behind The Scenes',
        description: 'Preparing for the Atlanta show',
        link: '/videos'
      },
      {
        id: 3,
        type: 'image',
        src: '/images/story-3.jpg',
        alt: 'Live performance',
        title: 'On Stage',
        description: 'Rocking the crowd in Miami',
        link: '/videos'
      },
      {
        id: 4,
        type: 'video',
        thumbnail: '/images/story-4.jpg',
        alt: 'New music video',
        title: 'Latest Visual',
        description: 'Check out the new video drop',
        videoId: 'dQw4w9WgXcQ',
        link: '/videos'
      },
      {
        id: 5,
        type: 'image',
        src: '/images/story-5.jpg',
        alt: 'Street art creation',
        title: 'Street Culture',
        description: 'Connecting with local artists',
        link: '/videos'
      }
    ];
  }

  return (
    <div ref={scrollRef} className={`visual-story-container ${isVisible ? 'visible' : ''}`}>
      {/* Left scroll button */}
      {!isMobile && showLeftArrow && (
        <button 
          className="scroll-button scroll-left" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}
      
      {/* Story items */}
      <div 
        className="visual-story-scroll" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {storyItems.map((item) => (
          <Link 
            href={item.link} 
            key={item.id}
            className="story-item"
          >
            {/* Image or video thumbnail */}
            <div className="story-media">
              <Image 
                src={item.type === 'video' ? item.thumbnail : item.src}
                alt={item.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 80vw, 33vw"
              />
              
              {item.type === 'video' && (
                <div className="play-indicator">
                  <div className="play-icon"></div>
                </div>
              )}
            </div>
            
            {/* Caption */}
            <div className="story-caption">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Right scroll button */}
      {!isMobile && showRightArrow && (
        <button 
          className="scroll-button scroll-right" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      )}
      
      <style jsx>{`
        .visual-story-container {
          position: relative;
          width: 100%;
          padding: 2rem 0;
          margin: 2rem 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .visual-story-container.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .visual-story-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 1.5rem;
          padding: 1rem 2rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Hide scrollbar for Firefox */
          -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        }
        
        .visual-story-scroll::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome/Safari */
        }
        
        .story-item {
          position: relative;
          min-width: 300px;
          height: 400px;
          border-radius: 8px;
          overflow: hidden;
          scroll-snap-align: center;
          text-decoration: none;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .story-item:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .story-media {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .story-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
          z-index: 2;
        }
        
        .story-caption h3 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .story-caption p {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        
        .play-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        
        .play-icon {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 10px 0 10px 20px;
          border-color: transparent transparent transparent white;
          margin-left: 4px;
        }
        
        .scroll-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          z-index: 3;
          transition: background 0.3s ease;
        }
        
        .scroll-button:hover {
          background: rgba(0, 0, 0, 0.9);
        }
        
        .scroll-left {
          left: 1rem;
        }
        
        .scroll-right {
          right: 1rem;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .visual-story-scroll {
            padding: 0.5rem;
            gap: 1rem;
          }
          
          .story-item {
            min-width: 80%;
            height: 300px;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  );
};

export default VisualStoryStrip;
