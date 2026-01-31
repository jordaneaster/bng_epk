'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';
import { FB_PIXEL_ID, pageview as fbPageview } from '@/lib/metaPixel';

// Create a separate component for the part that uses useSearchParams
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // Only run on the client side after hydration
    if (!isClient) return;
    
    // Check consent before tracking pageviews
    let hasConsent = false;
    try {
      hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
    } catch (e) {
    }
    
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
  }, [pathname, searchParams, isClient]);
  
  return null;
}

export default function Analytics() {
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
                try {
                  const hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
                  if (hasConsent) {
                    gtag('consent', 'update', {
                      'analytics_storage': 'granted'
                    });
                  }
                } catch (e) {
                }
              `,
            }}
          />
        </>
      )}
      
      {/* Facebook Pixel Script - Use onLoad instead of inline initialization */}
      {loadFbPixelScript && isClient && (
        <Script
          id="fb-pixel-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              try {
                // Check for consent before initializing the pixel
                const hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
                
                // Initialize with consent status
                if (hasConsent) {
                  fbq('consent', 'grant');
                  fbq('init', '${FB_PIXEL_ID}');
                  fbq('track', 'PageView');
                } else {
                  fbq('consent', 'revoke');
                  fbq('init', '${FB_PIXEL_ID}');
                }
              } catch (e) {
                // Initialize with consent revoked as fallback
                fbq('consent', 'revoke');
                fbq('init', '${FB_PIXEL_ID}');
              }
            `
          }}
        />
      )}
      
      {isClient && (
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
      )}
    </>
  );
}
