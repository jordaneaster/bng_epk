'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/videos', label: 'Videos' },
  { href: '/photos', label: 'Photos' },
  { href: '/live', label: 'BNG Live' },
  { href: '/blog', label: 'Blog' },
  { href: '/epk', label: 'EPK' },
  { href: '/merch', label: 'Merch' },
  { href: '/contact', label: 'Contact' },
];

const menuItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="container">
          <Link href="/" className="nav-logo" onClick={closeMobileMenu}>
            BNG<span className="logo-accent">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-overlay-bg" onClick={closeMobileMenu} />
            <motion.div
              className="mobile-menu-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <nav className="mobile-nav">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link
                      href={link.href}
                      className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="mobile-link-index">0{i + 1}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .nav-logo {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .logo-accent {
          color: var(--color-primary);
        }
        .desktop-nav {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin: 0;
        }
        .hamburger-menu {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 200;
          padding: 0.5rem;
          transition: color 0.3s ease;
        }
        .hamburger-menu:hover {
          color: var(--color-primary);
        }

        /* Mobile overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 150;
        }
        .mobile-overlay-bg {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }
        .mobile-menu-content {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 80%;
          max-width: 360px;
          background: linear-gradient(180deg, #0a0a0a 0%, #111 100%);
          padding: 6rem 2rem 2rem;
          overflow-y: auto;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
        }
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.3s ease;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--color-primary);
        }
        .mobile-link-index {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
          font-weight: 500;
          min-width: 1.5rem;
        }
        .mobile-nav-link.active .mobile-link-index {
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .hamburger-menu { display: block; }
        }
        @media (min-width: 769px) {
          .mobile-overlay { display: none; }
        }
      `}</style>
    </>
  );
}
