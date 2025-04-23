import '../styles/globals.css'; // Your global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Analytics from './Analytics';
import CookieConsent from './CookieConsent';
import StickySocialFollow from './StickySocialFollow';
export const metadata = {
  title: 'BNG NappSakk - EPK',
  description: 'Electronic Press Kit for BNG NappSakk',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <CookieConsent />
        <Navbar />
        <StickySocialFollow />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}