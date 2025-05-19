"use client";

import Link from 'next/link';
import QRCodeGenerator from './QRCodeGenerator';
import SocialFollow from './SocialFollow';
import MailingListSubscribe from './MailingListSubscribe';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = process.env.NEXT_PUBLIC_SITE_URL ? 
    `${process.env.NEXT_PUBLIC_SITE_URL}/epk` : 
    'https://bng-epk.vercel.app/epk';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-left">
            <div className="qr-section">
              <QRCodeGenerator url={epkUrl} />
              <p className="scan-text">Scan for EPK</p>
            </div>
            
            <div className="social-section">
              <SocialFollow />
            </div>
            
            <div className="navigation">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/music" className="nav-link">Music</Link>
              <Link href="/videos" className="nav-link">Videos</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
          
          <div className="footer-right">
            <MailingListSubscribe />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {currentYear} BNG NappSakk. All Rights Reserved.</p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8));
          color: white;
          padding: 3rem 0 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, transparent, #ff3c00, transparent);
        }
        
        .footer-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2.5rem;
        }
        
        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .scan-text {
          margin: 0.5rem 0 0;
          font-size: 0.8rem;
          opacity: 0.7;
        }
        
        .social-section {
          margin-top: 1rem;
        }
        
        .navigation {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.9rem;
        }
        
        .nav-link:hover {
          color: #ff3c00;
        }
        
        .footer-bottom {
          margin-top: 3rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .copyright {
          font-size: 0.85rem;
          opacity: 0.6;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-left {
            order: 2;
          }
          
          .footer-right {
            order: 1;
          }
          
          .qr-section {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
