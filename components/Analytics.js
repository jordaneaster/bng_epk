'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';
import { FB_PIXEL_ID, initFacebookPixel, pageview as fbPageview } from '@/lib/metaPixel';

// Create a separate component for the part that uses useSearchParams
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check consent before tracking pageviews
    const hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
    
    if (hasConsent) {
      // Google Analytics pageview tracking
      if (GA_TRACKING_ID) {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        pageview(url);
      }
      
      // Facebook Pixel pageview tracking
      if (FB_PIXEL_ID) {
        fbPageview();
      }
    }
  }, [pathname, searchParams]);
  
  return null;
}

export default function Analytics() {
  const loadFbPixelScript = FB_PIXEL_ID ? true : false;
  const loadGaScript = GA_TRACKING_ID ? true : false;
  
  return (
    <>
      {/* Google Analytics Script */}
      {loadGaScript && (
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
      )}
      
      {/* Facebook Pixel Script */}
      {loadFbPixelScript && (
        <Script
          id="fb-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              ${initFacebookPixel.toString()}
              initFacebookPixel();
            `
          }}
        />
      )}
      
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}
