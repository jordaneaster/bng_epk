import Link from 'next/link';
import QRCodeGenerator from './QRCodeGenerator';
import SocialFollow from './SocialFollow';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = 'https://bng-epk.vercel.app'; // Replace with your actual EPK URL

  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          <SocialFollow />
        </div>
        
        <div className="mt-3">
          <QRCodeGenerator url={epkUrl} />
        </div>
        
        <p className="mt-3">© {currentYear} BNG NappSakk. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
