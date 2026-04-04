"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSpotify, FaApple, FaYoutube, FaInstagram, FaTiktok, FaArrowUp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import QRCodeGenerator from './QRCodeGenerator';
import MailingListSubscribe from './MailingListSubscribe';

const socialLinks = [
  { icon: FaSpotify, href: 'https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe', label: 'Spotify', color: '#1DB954' },
  { icon: FaApple, href: 'https://music.apple.com/us/artist/bng-nappsakk/1599225835', label: 'Apple Music', color: '#FA57C1' },
  { icon: FaYoutube, href: 'https://www.youtube.com/@bngnappsakk', label: 'YouTube', color: '#FF0000' },
  { icon: FaInstagram, href: 'https://instagram.com/bngnappsakk', label: 'Instagram', color: '#E4405F' },
  { icon: FaTiktok, href: 'https://tiktok.com/@bngnappsakk', label: 'TikTok', color: '#00f2ea' },
  { icon: FaXTwitter, href: 'https://x.com/BNG_Nappsakk', label: 'X', color: '#fff' },
];

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/videos', label: 'Videos' },
  { href: '/live', label: 'Live' },
  { href: '/epk', label: 'EPK' },
  { href: '/press', label: 'Press' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/epk`
    : 'https://bng-epk.vercel.app/epk';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-container">
        {/* Top row: Brand + Social + Newsletter */}
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              BNG<span className="logo-dot">.</span>
            </Link>
            <p className="footer-tagline">
              Hip-Hop Visionary. Performer. Cultural Storyteller.
            </p>

            <div className="footer-socials">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={label}
                  style={{ '--hover-color': color }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-nav-section">
            <h4 className="footer-heading">Navigate</h4>
            <div className="footer-links">
              {footerLinks.map(link => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-subscribe-section">
            <h4 className="footer-heading">Stay Connected</h4>
            <MailingListSubscribe />
          </div>

          <div className="footer-qr-section">
            <h4 className="footer-heading">EPK</h4>
            <div className="qr-wrapper">
              <QRCodeGenerator url={epkUrl} />
              <p className="qr-label">Scan for press kit</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} BNG NappSakk. All Rights Reserved.
          </p>
          <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <FaArrowUp />
            <span>Top</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          position: relative;
          background: #0a0a0a;
          color: white;
          padding: 4rem 0 1.5rem;
          margin-top: 4rem;
          overflow: hidden;
        }

        .footer-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2rem);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr 0.8fr;
          gap: 2.5rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
        }

        .logo-dot {
          color: var(--color-primary);
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 0;
          max-width: 280px;
        }

        .footer-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .social-icon:hover {
          color: var(--hover-color);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
        }

        .footer-heading {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-primary);
          margin-bottom: 1.25rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #fff;
        }

        .footer-subscribe-section {
          min-width: 0;
        }

        .qr-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .qr-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 2.5rem 0 1.5rem;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .back-to-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.4);
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-heading);
          transition: all 0.3s ease;
        }

        .back-to-top:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-qr-section {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-nav-section {
            order: 3;
          }
          .footer-links {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem 1rem;
          }
        }
      `}</style>
    </footer>
  );
}
