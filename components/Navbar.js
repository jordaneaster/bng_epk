'use client'; // Needed for using hooks like usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/videos', label: 'Videos' },
  { href: '/photos', label: 'Photos' },
  { href: '/tour', label: 'Tour' },
  { href: '/press', label: 'Press' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="nav-logo">
        BNG NappSakk        
        </Link>
        <ul className="nav-links">
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
      </div>
    </nav>
  );
}
