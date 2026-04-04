import EPKDownloader from '../../components/EPKDownloader';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import Link from 'next/link';
import { createBaseMetadata } from '../../lib/seo';
import { FaFileDownload, FaEnvelope, FaMusic, FaVideo, FaImages, FaQuoteLeft, FaUser } from 'react-icons/fa';

export const metadata = createBaseMetadata({
  title: 'Electronic Press Kit - BNG NappSakk',
  description: 'Access the official Electronic Press Kit (EPK) for BNG NappSakk, including biography, photos, music, and more.',
  path: '/epk',
  ogImage: '/images/hero-bg.jpg',
});

export default function EPKPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bngmusicentertainment.com';

  const epkItems = [
    { icon: 'user', label: 'Artist biography & background' },
    { icon: 'music', label: 'Music links & discography' },
    { icon: 'video', label: 'Video links & content' },
    { icon: 'quote', label: 'Selected press quotes' },
    { icon: 'images', label: 'High-quality photos' },
    { icon: 'envelope', label: 'Contact information' },
  ];

  const iconMap = { user: FaUser, music: FaMusic, video: FaVideo, quote: FaQuoteLeft, images: FaImages, envelope: FaEnvelope };

  return (
    <div className="epk-page">
      {/* Hero */}
      <section className="epk-hero">
        <div className="container">
          <span className="hero-label">For Industry</span>
          <h1>Electronic <span className="text-gradient-gold">Press Kit</span></h1>
          <p className="hero-sub">Everything you need in one place.</p>
        </div>
      </section>

      <section className="epk-content section">
        <div className="container">
          <div className="epk-grid">
            {/* Main Column */}
            <div className="epk-main">
              <div className="download-card">
                <EPKDownloader />
              </div>

              <div className="includes-card">
                <h3>What&apos;s Included</h3>
                <ul className="includes-list">
                  {epkItems.map((item, i) => {
                    const Icon = iconMap[item.icon];
                    return (
                      <li key={i}>
                        <Icon className="include-icon" />
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="custom-note">
                  Need additional materials? <Link href="/contact">Contact us</Link> for custom EPK requests.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="epk-sidebar">
              <div className="qr-card">
                <QRCodeGenerator url={`${siteUrl}/epk`} size={180} />
                <p className="qr-label">Scan to access this EPK on mobile</p>
              </div>

              <div className="links-card">
                <h4>Quick Links</h4>
                <Link href="/press" className="quick-link">Press & Media</Link>
                <Link href="/music" className="quick-link">Discography</Link>
                <Link href="/videos" className="quick-link">Videos</Link>
                <Link href="/contact" className="quick-link">Booking</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .epk-page { background: #0a0a0a; min-height: 100vh; }

        .epk-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .epk-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
        }
        .hero-label {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--color-primary, #f0b429); margin-bottom: 0.75rem;
        }
        .epk-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900; color: #fff; margin: 0 0 0.5rem;
        }
        .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.45); margin: 0; }

        .epk-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
          max-width: 960px;
          margin: 0 auto;
        }

        .download-card, .includes-card, .qr-card, .links-card {
          background: #141414;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.04);
          padding: 2rem;
        }
        .download-card { margin-bottom: 1.5rem; }

        .includes-card h3 {
          font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0 0 1.25rem;
        }
        .includes-list {
          list-style: none; padding: 0; margin: 0 0 1.5rem;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .includes-list li {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.9rem; color: rgba(255,255,255,0.7);
        }
        .includes-list .include-icon {
          color: var(--color-primary, #f0b429);
          font-size: 0.85rem;
          width: 20px;
          flex-shrink: 0;
        }
        .custom-note {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 1rem;
          margin: 0;
        }
        .custom-note a {
          color: var(--color-primary, #f0b429);
          text-decoration: none;
          font-weight: 600;
        }

        .qr-card {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .qr-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin-top: 1rem;
        }

        .links-card h4 {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.4);
          margin: 0 0 1rem;
        }
        .quick-link {
          display: block;
          padding: 0.6rem 0;
          font-size: 0.9rem; font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s ease;
        }
        .quick-link:hover { color: var(--color-primary, #f0b429); }
        .quick-link:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .epk-hero { padding: 6.5rem 0 2rem; }
          .epk-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
        }
        @media (max-width: 480px) {
          .epk-hero h1 { font-size: 2rem; }
          .epk-grid { max-width: 100%; }
        }
      ` }} />
    </div>
  );
}
