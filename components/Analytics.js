'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;
    
    // Check consent before tracking pageviews
    const hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
    if (hasConsent) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics tracking disabled: NEXT_PUBLIC_GA_ID not set.");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              // Default to requiring consent
              'analytics_storage': 'denied'
            });
            
            // Check for existing consent
            const hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
            if (hasConsent) {
              gtag('consent', 'update', {
                'analytics_storage': 'granted'
              });
            }
          `,
        }}
      />
    </>
  );
}
