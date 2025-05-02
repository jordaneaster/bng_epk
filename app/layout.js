import '../styles/globals.css'; // Your global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';
import StickySocialFollow from '@/components/StickySocialFollow';

export const metadata = {
  title: 'BNG NappSakk - EPK',
  description: 'Hip-Hop Visionary | Performer | Fashion Icon',
  metadataBase: new URL('https://bngmusicentertainment.com'),
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  charset: 'utf-8',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    title: 'BNG NappSakk - Official Website',
    description: 'Hip-Hop Visionary | Performer | Fashion Icon',
    url: 'https://bngmusicentertainment.com',
    siteName: 'BNG Music',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://bngmusicentertainment.com/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'BNG NappSakk - Official Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@BNG_Nappsakk',
    title: 'BNG NappSakk - Official Website',
    description: 'Hip-Hop Visionary | Performer | Fashion Icon',
    images: ['https://bngmusicentertainment.com/images/hero-bg.jpg'],
  },
  alternates: {
    canonical: 'https://bngmusicentertainment.com',
  },
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