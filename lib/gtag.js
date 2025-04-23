export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Custom events
export const trackClickEvent = (eventName, params = {}) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  
  window.gtag('event', eventName, params);
};

// E-commerce tracking (if needed)
export const trackPurchase = (transaction) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  
  window.gtag('event', 'purchase', {
    transaction_id: transaction.id,
    value: transaction.value,
    currency: transaction.currency,
    items: transaction.items,
  });
};
