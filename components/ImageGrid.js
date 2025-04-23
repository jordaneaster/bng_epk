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
      {/* Add gap for spacing between cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            // Use standard Tailwind classes without !important
            className="image-item bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out" // Removed ! prefix
            style={{ cursor: 'pointer' }}
            onClick={() => openLightbox(image)}
          >
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              width={400}
              height={300}
              style={{ objectFit: 'contain', width: '100%', height: 'auto', aspectRatio: '4/3' }}
              // Rely on parent div's overflow-hidden for rounding
              className="block" // Removed rounded-xl
            />
          </div>
        ))}
      </div>

      {lightboxImage && (
        // Improved lightbox styling: semi-transparent background, centered content
        <div
          className="lightbox fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={closeLightbox}
        >
          {/* Prevent clicks on the image itself from closing the lightbox */}
          <div onClick={(e) => e.stopPropagation()} className="relative">
             <Image
                src={lightboxImage.url}
                alt={lightboxImage.alt || 'Enlarged photo'}
                width={1200} // Adjust max width as needed
                height={800} // Adjust max height as needed
                style={{ objectFit: 'contain', maxHeight: '90vh', maxWidth: '90vw' }}
                className="rounded-lg" // Optional: round corners on lightbox image
             />
             {/* Optional: Add a close button */}
             <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 text-2xl leading-none hover:bg-opacity-75"
                aria-label="Close lightbox"
             >
                &times;
             </button>
          </div>
        </div>
      )}
    </>
  );
}
