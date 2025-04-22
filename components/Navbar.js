'use client'; // Needed for using hooks like usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; // Import useState
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/videos', label: 'Videos' },
  { href: '/photos', label: 'Photos' },
  { href: '/tour', label: 'Tour' },
  // { href: '/press', label: 'Press' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on link click
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    // Add conditional class based on mobile menu state
    <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/*
        CSS Adjustments Needed for Mobile View:
        - Target '.nav-logo' in a mobile media query to reduce its font size, width, or padding.
        - Target '.nav-links li' or '.nav-links a' in a mobile media query to reduce padding, margin, or font size.
        - Consider allowing '.nav-links' to wrap onto multiple lines if needed (`flex-wrap: wrap;`).
        Ensure CSS rules allow all content to be fully visible on small screens.
      */}
      <div className="container">
        <Link href="/" className="nav-logo" onClick={handleLinkClick}>
          BNG NappSakk
        </Link>

        {/* Hamburger Menu Button (visible only on mobile via CSS) */}
        <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Add onClick handler to links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
                onClick={handleLinkClick} // Close menu on link click
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
