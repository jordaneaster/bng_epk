'use client';
import { useEffect, useState } from 'react';

export default function QRCodeGenerator({ url }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    // Using the Google Charts API to generate QR code
    const encodedUrl = encodeURIComponent(url);
    setQrCodeUrl(`https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=200x200`);
  }, [url]);
  
  return (
    <div className="text-center">
      <h3 className="mb-2">Scan EPK</h3>
      <div className="qr-code-container">
        {qrCodeUrl && <img src={qrCodeUrl} alt="EPK QR Code" width={150} height={150} />}
      </div>
    </div>
  );
}
