'use client';

import { useCallback } from 'react';
import { event, trackClickEvent } from '@/lib/gtag';

export function useAnalytics() {
  // Basic event tracking
  const trackEvent = useCallback(({ action, category, label, value }) => {
    event({ action, category, label, value });
  }, []);
  
  // Simplified event tracking for most use cases
  const event = useCallback((eventName, eventParams = {}) => {
    trackClickEvent(eventName, eventParams);
  }, []);
  
  // Track form submissions
  const trackFormSubmission = useCallback((formName, formData = {}) => {
    trackClickEvent('form_submission', {
      form_name: formName,
      ...formData
    });
  }, []);

  // Track outbound links
  const trackOutboundLink = useCallback((url) => {
    trackClickEvent('outbound_link', { url });
  }, []);
  
  // Track social media interactions
  const trackSocialInteraction = useCallback((network, action) => {
    trackClickEvent('social_interaction', {
      network,
      action
    });
  }, []);
  
  // Track video interactions
  const trackVideoInteraction = useCallback((videoId, action, platform = 'youtube') => {
    trackClickEvent('video_interaction', {
      video_id: videoId,
      action,
      platform
    });
  }, []);

  return {
    trackEvent,
    event,
    trackFormSubmission,
    trackOutboundLink,
    trackSocialInteraction,
    trackVideoInteraction
  };
}
