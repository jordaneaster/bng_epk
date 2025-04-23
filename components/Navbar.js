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
      <div className="container">
        <Link href="/" className="nav-logo" onClick={handleLinkClick}>
          BNG NappSakk
        </Link>

        {/* Hamburger Menu Button (visible only on mobile via CSS) */}
        <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

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
