"use client";

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

const Hero = ({ title, subtitle, bgImage }) => {
  const [imgSrc, setImgSrc] = useState(bgImage || '/images/hero-bg.jpg');

  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    if (imgSrc !== '/images/hero-bg.jpg') {
      setImgSrc('/images/hero-bg.jpg');
    }
  };

  return (
    <div 
      className="hero-section" 
      style={{ 
        position: 'relative', 
        height: '110vh', 
        minHeight: '350px', 
        overflow: 'auto', 
        color: '#fff' 
      }}
    >
      <Image 
        src={imgSrc}
        alt="Hero Background" 
        fill 
        priority
        onError={handleError}
        style={{ 
          objectFit: 'contain', 
          filter: 'brightness(0.6)' 
        }}
        sizes="100vw"
        quality={85}
      />
      <div 
        className="hero-content" 
        style={{ 
          paddingTop: '20vh', // Adjust this value to position the text vertically
          position: 'relative', 
          zIndex: 1, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
          textAlign: 'center' 
        }}
      >
        <div className="fade-in">
          <h1 className="mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default Hero;
