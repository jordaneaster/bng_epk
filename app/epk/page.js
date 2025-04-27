import EPKDownloader from '../../components/EPKDownloader';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import Link from 'next/link';
import { createBaseMetadata } from '../../lib/seo';

// Export metadata for this page
export const metadata = createBaseMetadata({
  title: 'Electronic Press Kit - BNG Music Entertainment',
  description: 'Access the official Electronic Press Kit (EPK) for BNG Music Entertainment, including biography, photos, music, and more.',
  path: '/epk',
  ogImage: '/images/hero-bg.jpg',
});

export default function EPKPage() {
  // Get the current site URL for the QR code
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site-url.com';
  
  return (
    <div className="d-flex justify-content-center">
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="fade-in">
          <h1 className="text-center mb-4">Electronic Press Kit</h1>
          
          <div className="row">
            <div className="col-md-8 mb-4">
              <EPKDownloader />
              
              <div className="card mt-4 p-4" style={{ 
                backgroundColor: 'var(--color-card-bg)', 
                borderRadius: 'var(--border-radius)'
              }}>
                <h3 className="mb-3">What&apos;s included in the EPK?</h3>
                <ul>
                  <li>Artist biography and background</li>
                  <li>Music links and discography</li>
                  <li>Video links</li>
                  <li>Selected press quotes</li>
                  <li>High-quality photos</li>
                  <li>Contact information</li>
                </ul>
                
                <p className="mt-3">
                  Need additional materials? <Link href="/contact">Contact us</Link> for custom EPK requests.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card p-4" style={{ 
                backgroundColor: 'var(--color-card-bg)', 
                borderRadius: 'var(--border-radius)'
              }}>
                <QRCodeGenerator url={`${siteUrl}/epk`} size={200} />
                <p className="mt-3 text-center">Scan this QR code to access this EPK page on your mobile device</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
