'use client';
import { QRCodeCanvas } from 'qrcode.react'; // Import the component

export default function QRCodeGenerator({ url, size = 150 }) { // Added size prop with default

  return (
    <div className="text-center">
      <h3 className="mb-2">Scan EPK</h3>
      <div className="qr-code-container" style={{ display: 'inline-block', background: 'white', padding: '5px' }}> {/* Optional: Add padding/background */}
        {/* Render QRCodeCanvas if url is provided */}
        {url ? (
          <QRCodeCanvas
            value={url}
            size={size}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"} // Error correction level (L, M, Q, H)
            includeMargin={false} // Set to true if you want a margin
          />
        ) : (
          // Optional: Show a loading or placeholder state
          <p>Loading QR Code...</p>
        )}
      </div>
    </div>
  );
}
