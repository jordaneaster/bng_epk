import Link from 'next/link';
import QRCodeGenerator from './QRCodeGenerator';
import { FaSpotify, FaAppleMusic, FaSoundcloud, FaYoutube, FaInstagram, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si'; // Using SiApplemusic since FaAppleMusic might not exist

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = 'https://bng-epk.vercel.app'; // Replace with your actual EPK URL

  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          {/* Replace text links with icons */}
          <Link href="https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
            <FaSpotify />
          </Link>
          <Link href="https://music.apple.com/us/artist/bng-nappsakk/1599225835" target="_blank" rel="noopener noreferrer" aria-label="Apple Music">
            <SiApplemusic />
          </Link>
          <Link href="https://soundcloud.com/search?q=bng%20nappsakk" target="_blank" rel="noopener noreferrer" aria-label="SoundCloud">
            <FaSoundcloud />
          </Link>
          <Link href="https://www.youtube.com/@bngnappsakk" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </Link>
          <Link href="https://www.instagram.com/p/DIjZF9FRTyG/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </Link>
          <Link href="https://x.com/BNG_Nappsakk" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </Link>
          <Link href="https://www.facebook.com/napp.sakk.9" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </Link>
          <Link href="https://www.tiktok.com/@bng_nappsakk" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
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
