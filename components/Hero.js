"use client";

import Image from 'next/image';
import { useState } from 'react'; // Removed unused useEffect

export default function Hero({ title, subtitle, bgImage }) {
  const [imgSrc, setImgSrc] = useState(bgImage || '/images/hero-bg.jpg');
  
  // Handle image loading error
  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    // Fallback to a different image if the original fails
    if (imgSrc !== '/images/hero-bg.jpg') {
      setImgSrc('/images/hero-bg.jpg');
    }
  };

  return (
    // Ensure the section itself is the relative positioning context
    <section className="hero" style={{ position: 'relative', height: '80vh', minHeight: '500px', overflow: 'hidden', color: '#fff' /* Add text color for visibility */ }}>
        
        {/* Apply zIndex directly to the Image component */}
        <Image 
          src={imgSrc}
          alt="Hero Background" 
          fill 
          priority
          onError={handleError}
          style={{ 
            objectFit: 'cover', 
            filter: 'brightness(0.6)', 
            // zIndex: -1 // Position the image behind the content
          }}
          sizes="100vw" // Ensure sizes prop is appropriate
          quality={85} // Adjusted quality slightly
        />
        
        {/* Removed the intermediate absolute div wrapper */}
      
      {/* Ensure content container is positioned relatively to stack above the zIndex: -1 image */}
      <div className="container" style={{ 
        position: 'relative', // Make sure content stacks correctly
        zIndex: 1, // Explicitly set zIndex higher than the image
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        textAlign: 'center' // Center text horizontally
      }}>
        <div className="fade-in">
          <h1 className="mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
