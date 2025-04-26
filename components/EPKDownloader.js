'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { generateEPK } from '../utils/pdfGenerator';
import { event as trackEvent } from '@/lib/gtag'; // Update import to use existing gtag

export default function EPKDownloader() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(10);

    // Track the EPK download event using your existing gtag setup
    trackEvent({
      action: 'epk_download',
      category: 'engagement',
      label: 'EPK Download'
    });

    try {
      // Fetch data from our API
      const response = await fetch('/api/generate-epk');
      setProgress(30);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch EPK data');
      }
      
      const { data } = await response.json();
      setProgress(50);
      
      // Generate PDF with the fetched data
      const pdf = await generateEPK(
        data.artist,
        data.music,
        data.videos,
        null, // Press data not needed for now
        data.images
      );
      
      setProgress(80);
      
      // Generate PDF file and download
      const pdfBlob = pdf.output('blob');
      saveAs(pdfBlob, `${data.artist.name.replace(/\s+/g, '_')}_EPK.pdf`);
      
      setProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
      }, 2000);
      
    } catch (err) {
      console.error('EPK generation error:', err);
      setError(err.message || 'Failed to generate EPK');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="epk-download-container">
      <div className="card p-4" style={{ 
        backgroundColor: 'var(--color-card-bg)', 
        borderRadius: 'var(--border-radius)'
      }}>
        <h3 className="mb-3">Electronic Press Kit</h3>
        <p>
          Download a complete EPK with artist information, music, videos, and photos in a 
          single PDF file that you can share with promoters, venues, and media.
        </p>
        
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="btn"
          style={{ width: '100%' }}
        >
          {isGenerating ? 'Generating EPK...' : 'Download EPK (PDF)'}
        </button>
        
        {isGenerating && progress > 0 && (
          <div className="progress mt-3" style={{ height: '5px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${progress}%`, 
                backgroundColor: 'var(--color-primary)',
              }} 
              aria-valuenow={progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
