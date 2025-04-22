import Link from 'next/link';
import QRCodeGenerator from './QRCodeGenerator';
import { FaSpotify, FaAppleMusic, FaSoundcloud, FaYoutube, FaInstagram, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si'; // Using SiApplemusic since FaAppleMusic might not exist

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = typeof window !== 'undefined' ? window.location.origin : 'https://artist-epk.com';

  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          {/* Replace text links with icons */}
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
            <FaSpotify />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Apple Music">
            <SiApplemusic />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="SoundCloud">
            <FaSoundcloud />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok />
          </Link>
        </div>
        
        <div className="mt-3">
          <QRCodeGenerator url={epkUrl} />
        </div>
        
        <p className="mt-3">© {currentYear} ARTIST NAME. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
