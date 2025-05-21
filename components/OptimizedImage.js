"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority = false,
  quality = 80,
  fill = false,
  className = '',
  style = {},
  onClick,
  onLoad,
  placeholder = 'blur',
  blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdQIQY+J8ewAAAABJRU5ErkJggg==',
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Handle image loading
  const handleImageLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };
  
  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Responsive sizes attribute based on width
  const getSizes = () => {
    if (sizes) return sizes;
    
    if (!width) return '100vw';
    
    // Responsive sizes based on image width
    if (width < 640) return '100vw';
    if (width < 768) return '50vw';
    return `${width}px`;
  };
  
  // Get image format - if src ends with jpg/jpeg/png, use webp
  const getImgSrc = () => {
    // If it's already a webp, or a specially formatted URL that might
    // have query params (like Cloudinary), leave it as-is
    if (src.includes('webp') || 
        src.includes('?') || 
        src.startsWith('data:') ||
        src.includes('/api/')) {
      return src;
    }
    
    // For simple image paths, add a webp version
    if (src.match(/\.(jpe?g|png)$/i)) {
      // Some servers can do on-the-fly conversion with a query param
      return `${src}?format=webp`;
    }
    
    return src;
  };
  
  const combinedClassName = `optimized-image ${isLoading ? 'image-loading' : ''} ${error ? 'image-error' : ''} ${className}`;
  
  return (
    <div className="image-wrapper">
      {fill ? (
        <Image
          src={error ? '/images/placeholder.jpg' : getImgSrc()}
          alt={alt}
          fill
          sizes={getSizes()}
          quality={quality}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={combinedClassName}
          style={{
            objectFit: 'cover',
            ...style
          }}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      ) : (
        <Image
          src={error ? '/images/placeholder.jpg' : getImgSrc()}
          alt={alt}
          width={width}
          height={height}
          sizes={getSizes()}
          quality={quality}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={combinedClassName}
          style={style}
          priority={priority}
          onClick={onClick}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      )}
      {isLoading && <div className="image-loader"></div>}
    </div>
  );
}
