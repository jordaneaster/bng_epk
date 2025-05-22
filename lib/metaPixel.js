export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  // Prevent execution during SSR
  if (typeof window === 'undefined') return;
  
  // Don't reinitialize if already set up
  if (window.fbq) return;
  
  // Safely check for consent using try-catch to avoid hydration errors
  let hasConsent = false;
  try {
    hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
  } catch (e) {
    console.warn('Could not access localStorage for consent check:', e);
  }
  
  // Store the consent state - used when initializing fbq
  window.fbConsent = hasConsent;
  
  // Set up the pixel code with a try-catch to catch any initialization errors
  try {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize with consent status
    if (hasConsent) {
      window.fbq('consent', 'grant');
      window.fbq('init', FB_PIXEL_ID);
      window.fbq('track', 'PageView');
    } else {
      window.fbq('consent', 'revoke');
      window.fbq('init', FB_PIXEL_ID); // Still initialize but with consent revoked
    }
  } catch (error) {
    console.error('Error initializing Facebook Pixel:', error);
  }
};

// Page view tracking
export const pageview = () => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  } catch (e) {
    console.error('Error tracking pageview with Meta Pixel:', e);
  }
};

// Helper function to send server-side conversion event
async function sendServerConversion(eventName, params = {}, userData = {}) {
  if (typeof window === 'undefined') return;
  
  // Check for consent before sending server-side events
  let hasConsent = false;
  try {
    hasConsent = localStorage.getItem('cookieConsent') === 'accepted';
  } catch (e) {
    console.warn('Could not access localStorage for consent check:', e);
    return; // Exit if we can't verify consent
  }
  
  if (!hasConsent) return;
  
  try {
    // Generate a unique event ID for deduplication
    const eventId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Send the event to our server-side endpoint
    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventId,
        userData,
        customData: params,
        eventSourceUrl: window.location.href,
      }),
    });
    
    const result = await response.json();
    if (!result.success) {
      console.warn('Server-side conversion tracking failed:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error sending server-side conversion:', error);
    return null;
  }
}

// Standard events tracking - dual tracking (client + server)
export const event = (name, params = {}, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', name, params);
      
      // Additionally send to server-side Conversions API
      sendServerConversion(name, params, userData).catch(err => {
        console.error('Server conversion API error:', err);
      });
    }
  } catch (e) {
    console.error('Error tracking event with Meta Pixel:', e);
  }
};

// Custom events tracking - dual tracking
export const customEvent = (name, params = {}, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('trackCustom', name, params);
      
      // Additionally send to server-side Conversions API
      sendServerConversion(name, params, userData).catch(err => {
        console.error('Server conversion API error:', err);
      });
    }
  } catch (e) {
    console.error('Error tracking custom event with Meta Pixel:', e);
  }
};

// Update consent status for Meta Pixel
export const updateConsentStatus = (hasConsent) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      if (hasConsent) {
        window.fbq('consent', 'grant');
      } else {
        window.fbq('consent', 'revoke');
      }
      window.fbConsent = hasConsent;
    }
  } catch (e) {
    console.error('Error updating Meta Pixel consent status:', e);
  }
};

// E-commerce events with dual tracking

// Track when a product is viewed
export const trackViewContent = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'ViewContent', data);
      
      // Server-side tracking
      sendServerConversion('ViewContent', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking ViewContent with Meta Pixel:', e);
  }
};

// Track when a product is added to cart
export const trackAddToCart = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'AddToCart', data);
      
      // Server-side tracking
      sendServerConversion('AddToCart', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking AddToCart with Meta Pixel:', e);
  }
};

// Track when checkout is initiated
export const trackInitiateCheckout = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'InitiateCheckout', data);
      
      // Server-side tracking
      sendServerConversion('InitiateCheckout', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking InitiateCheckout with Meta Pixel:', e);
  }
};

// Track purchase completion
export const trackPurchase = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'Purchase', data);
      
      // Server-side tracking
      sendServerConversion('Purchase', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking Purchase with Meta Pixel:', e);
  }
};

// Track lead generation
export const trackLead = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'Lead', data);
      
      // Server-side tracking
      sendServerConversion('Lead', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking Lead with Meta Pixel:', e);
  }
};

// Track completed registration
export const trackCompleteRegistration = (data, userData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      // Client-side tracking
      window.fbq('track', 'CompleteRegistration', data);
      
      // Server-side tracking
      sendServerConversion('CompleteRegistration', data, userData).catch(console.error);
    }
  } catch (e) {
    console.error('Error tracking CompleteRegistration with Meta Pixel:', e);
  }
};
