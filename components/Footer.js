import Link from 'next/link';
import QRCodeGenerator from './QRCodeGenerator';
import SocialFollow from './SocialFollow';
import MailingListSubscribe from './MailingListSubscribe';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const epkUrl = process.env.NEXT_PUBLIC_SITE_URL ? 
    `${process.env.NEXT_PUBLIC_SITE_URL}/epk` : 
    'https://bng-epk.vercel.app/epk'; // Update URL to point specifically to EPK page

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="social-links">
              <SocialFollow />
            </div>
            
            <div className="mt-3">
              <QRCodeGenerator url={epkUrl} />
              <p className="text-center mt-2 small">Scan for EPK</p> {/* Add label for QR code */}
            </div>
          </div>
          
          <div className="col-md-6">
            <MailingListSubscribe />
          </div>
        </div>
        
        <p className="mt-4 text-center">© {currentYear} BNG NappSakk. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
