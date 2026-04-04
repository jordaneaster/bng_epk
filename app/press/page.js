import PasswordProtection from '../../components/PasswordProtection';
import Image from 'next/image';
import Link from 'next/link';
import { pressItems, pressKitUrl } from '../../data/mockData';
import { createBaseMetadata } from '../../lib/seo';
import { FaDownload, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

export const metadata = {
  ...createBaseMetadata({
    title: 'Press & Media - BNG NappSakk',
    description: 'Access press materials, media coverage, and more for BNG NappSakk.',
    path: '/press',
  }),
  robots: { index: false, follow: false },
};

function PressContent() {
  return (
    <div className="press-page">
      {/* Hero */}
      <section className="press-hero">
        <div className="container">
          <span className="hero-label">Industry</span>
          <h1>Press & <span className="text-gradient-gold">Media</span></h1>
          <p className="hero-sub">Coverage, features, and media resources.</p>
          <div className="hero-actions">
            <Link href={pressKitUrl} className="btn" target="_blank" rel="noopener noreferrer">
              <FaDownload /> Download Press Kit
            </Link>
            <Link href="/epk" className="btn btn-outline">
              Electronic Press Kit <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="coverage-section section">
        <div className="container">
          <h2 className="section-heading">Press <span className="text-gradient-gold">Coverage</span></h2>
          <div className="press-grid">
            {pressItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="press-card"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="press-logo-wrap">
                  <Image
                    src={item.logo}
                    alt={item.publication}
                    width={120}
                    height={50}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="press-body">
                  <span className="press-pub">{item.publication}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div className="press-footer">
                    <span className="press-date">{item.date}</span>
                    <span className="press-link">Read <FaExternalLinkAlt /></span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .press-page { background: #0a0a0a; min-height: 100vh; }

        .press-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .press-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
        }
        .hero-label {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--color-primary, #f0b429);
          margin-bottom: 0.75rem;
        }
        .press-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900; color: #fff; margin: 0 0 0.5rem;
        }
        .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.45); margin: 0 0 2rem; }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        .section-heading {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800; text-transform: uppercase;
          text-align: center; margin-bottom: 2.5rem; color: #fff;
        }

        .press-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: 1.5rem;
        }
        .press-card {
          background: #141414;
          border-radius: 12px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          text-decoration: none; color: inherit;
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          display: flex; flex-direction: column;
          animation: fadeInUp 0.5s ease both;
        }
        .press-card:hover {
          transform: translateY(-4px);
          border-color: rgba(240,180,41,0.12);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .press-logo-wrap {
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          min-height: 80px;
        }
        .press-body { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
        .press-pub {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--color-primary, #f0b429); margin-bottom: 0.5rem;
        }
        .press-body h3 {
          font-size: 1.1rem; font-weight: 700; color: #fff;
          margin: 0 0 0.5rem; line-height: 1.3;
        }
        .press-body p {
          font-size: 0.85rem; color: rgba(255,255,255,0.5);
          line-height: 1.5; margin: 0 0 auto;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .press-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 1rem; padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .press-date { font-size: 0.75rem; color: rgba(255,255,255,0.3); }
        .press-link {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.8rem; font-weight: 600;
          color: var(--color-primary, #f0b429);
        }

        @media (max-width: 1024px) {
          .press-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
        }
        @media (max-width: 480px) {
          .press-hero { padding: 6.5rem 0 2rem; }
          .press-hero h1 { font-size: 2rem; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      ` }} />
    </div>
  );
}

export default function Press() {
  return (
    <PasswordProtection>
      <PressContent />
    </PasswordProtection>
  );
}
