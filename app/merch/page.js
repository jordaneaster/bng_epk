import Link from 'next/link';
import Image from 'next/image';
import { createBaseMetadata } from '../../lib/seo';
import { FaShoppingBag, FaArrowRight } from 'react-icons/fa';

export const metadata = createBaseMetadata({
  title: 'Merch - BNG NappSakk Official Merchandise',
  description: 'Shop official BNG NappSakk merchandise — tees, hoodies, hats, and limited drops.',
  path: '/merch',
  ogImage: '/images/hero-bg.jpg',
});

const merchItems = [
  {
    id: 1,
    name: 'BNG Logo Tee',
    price: '$35',
    image: '/images/gallery/merch-tee.jpg',
    tag: 'New',
  },
  {
    id: 2,
    name: 'NappSakk Hoodie',
    price: '$65',
    image: '/images/gallery/merch-hoodie.jpg',
    tag: 'Popular',
  },
  {
    id: 3,
    name: 'Streets Most Wanted Cap',
    price: '$30',
    image: '/images/gallery/merch-cap.jpg',
    tag: null,
  },
  {
    id: 4,
    name: 'BNG Shorts',
    price: '$40',
    image: '/images/gallery/merch-shorts.jpg',
    tag: 'Limited',
  },
];

export default function MerchPage() {
  return (
    <div className="merch-page">
      {/* Hero */}
      <section className="merch-hero">
        <div className="container">
          <span className="hero-label">Official Store</span>
          <h1>BNG <span className="text-gradient-gold">Merch</span></h1>
          <p className="hero-sub">Rep the movement</p>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="section">
        <div className="container">
          <div className="featured-banner">
            <div className="banner-content">
              <span className="banner-badge">Coming Soon</span>
              <h2>Official Merch Store</h2>
              <p>
                The BNG NappSakk official merchandise store is launching soon. 
                Be the first to grab exclusive tees, hoodies, hats, and limited-edition drops.
              </p>
              <Link href="/contact" className="notify-btn">
                <FaShoppingBag />
                <span>Get Notified</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Preview <span className="text-gradient-gold">Drops</span></h2>
          <div className="merch-grid">
            {merchItems.map((item, i) => (
              <div key={item.id} className="merch-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="merch-image">
                  <div className="image-placeholder">
                    <FaShoppingBag />
                  </div>
                  {item.tag && <span className="merch-tag">{item.tag}</span>}
                </div>
                <div className="merch-info">
                  <h3>{item.name}</h3>
                  <span className="merch-price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-card">
            <h3>Want early access?</h3>
            <p>Follow us on social media for exclusive merch drops and announcements.</p>
            <div className="cta-links">
              <a href="https://instagram.com/bng_nappsakk" target="_blank" rel="noopener noreferrer" className="cta-link">
                Instagram <FaArrowRight />
              </a>
              <Link href="/contact" className="cta-link">
                Contact Us <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .merch-page { background: #0a0a0a; min-height: 100vh; }

        .merch-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .merch-hero::after {
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
        .merch-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900; color: #fff; margin: 0 0 0.5rem;
        }
        .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.45); margin: 0; }

        /* Featured Banner */
        .featured-banner {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid rgba(240,180,41,0.12);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .banner-badge {
          display: inline-block;
          background: var(--color-primary, #f0b429);
          color: #000;
          font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.12em;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          margin-bottom: 1.25rem;
        }
        .banner-content h2 {
          font-size: 1.8rem; font-weight: 900; color: #fff;
          margin: 0 0 0.75rem;
        }
        .banner-content p {
          font-size: 0.95rem; color: rgba(255,255,255,0.5);
          line-height: 1.7; max-width: 480px; margin: 0 auto 1.5rem;
        }
        .notify-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--color-primary, #f0b429);
          color: #000;
          font-size: 0.85rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          padding: 0.85rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .notify-btn:hover { opacity: 0.9; transform: translateY(-2px); }

        /* Grid */
        .section-title {
          font-size: 1.6rem; font-weight: 800; color: #fff;
          text-align: center; margin-bottom: 2rem;
        }
        .merch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
          max-width: 960px;
          margin: 0 auto;
        }
        .merch-card {
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          transition: transform 0.3s ease, border-color 0.3s ease;
          animation: fadeUp 0.5s ease both;
        }
        .merch-card:hover {
          transform: translateY(-4px);
          border-color: rgba(240,180,41,0.15);
        }
        .merch-image {
          position: relative;
          aspect-ratio: 1/1;
          background: #1a1a1a;
        }
        .image-placeholder {
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 100%;
          color: rgba(255,255,255,0.08);
          font-size: 2.5rem;
        }
        .merch-tag {
          position: absolute;
          top: 0.75rem; left: 0.75rem;
          background: var(--color-primary, #f0b429);
          color: #000;
          font-size: 0.6rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .merch-info { padding: 1rem 1.25rem; }
        .merch-info h3 {
          font-size: 0.95rem; font-weight: 700; color: #fff;
          margin: 0 0 0.25rem;
        }
        .merch-price {
          font-size: 0.85rem; font-weight: 600;
          color: var(--color-primary, #f0b429);
        }

        /* CTA */
        .cta-card {
          text-align: center;
          background: #141414;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          max-width: 540px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .cta-card h3 { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0 0 0.5rem; }
        .cta-card p { font-size: 0.9rem; color: rgba(255,255,255,0.45); margin: 0 0 1.5rem; }
        .cta-links { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
        .cta-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.85rem; font-weight: 700;
          color: var(--color-primary, #f0b429);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .cta-link:hover { opacity: 0.8; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .merch-hero { padding: 6.5rem 0 2rem; }
          .featured-banner { padding: 2rem 1.25rem; }
          .banner-content h2 { font-size: 1.4rem; }
          .merch-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .cta-card { padding: 2rem 1.25rem; }
        }
        @media (max-width: 480px) {
          .merch-hero h1 { font-size: 2rem; }
          .merch-grid { grid-template-columns: 1fr; max-width: 300px; margin: 0 auto; }
        }
      ` }} />
    </div>
  );
}
