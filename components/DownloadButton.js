'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

export default function DownloadButton({ url = '/press-kit.zip', label = 'Download Press Kit' }) {
  const { event } = useAnalytics();

  const handleDownload = () => {
    event('download_epk');
    // Add your download logic here, e.g., initiating a file download
    window.location.href = url;
  };

  return (
    <button 
      onClick={handleDownload}
      className="download-button"
    >
      {label}
    </button>
  );
}