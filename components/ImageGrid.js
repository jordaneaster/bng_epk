'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageGrid({ images }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  
  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = '';
  };
  
  return (
    <>
      <div className="grid grid-cols-2 grid-cols-3">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="image-item" 
            style={{ cursor: 'pointer' }}
            onClick={() => openLightbox(image)}
          >
            <Image 
              src={image.url} 
              alt={image.alt || `Gallery image ${index + 1}`} 
              width={400} 
              height={300}
              style={{ objectFit: 'contain', height: '300px', width: '100%' }}
              className="shadow-sm"
            />
          </div>
        ))}
      </div>
      
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <Image 
            src={lightboxImage.url} 
            alt={lightboxImage.alt || 'Enlarged photo'} 
            width={1200} 
            height={800} 
            style={{ objectFit: 'contain', maxHeight: '90vh' }}
          />
        </div>
      )}
    </>
  );
}
