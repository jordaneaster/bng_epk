'use client';

import { useCallback, useState } from 'react';
import { event as gaEvent, trackClickEvent } from '@/lib/gtag';
import { event as fbEvent, customEvent as fbCustomEvent } from '@/lib/metaPixel';

export function useAnalytics() {
  // State to store user data for enhanced tracking
  const [userData, setUserData] = useState({});
  
  // Update user data when available (e.g. after login/form submit)
  const updateUserData = useCallback((data) => {
    setUserData(prevData => ({
      ...prevData,
      ...data
    }));
  }, []);
  
  // Basic event tracking
  const trackEvent = useCallback(({ action, category, label, value }) => {
    // Track with Google Analytics
    gaEvent({ action, category, label, value });
    
    // Also track with Facebook Pixel (mapping GA params to FB params)
    fbEvent(action, {
      category,
      label,
      value
    }, userData); // Pass userData for server-side conversion API
  }, [userData]);
  
  // Simplified event tracking for most use cases
  const event = useCallback((eventName, eventParams = {}) => {
    // Track with Google Analytics
    trackClickEvent(eventName, eventParams);
    
    // Also track with Facebook Pixel
    fbCustomEvent(eventName, eventParams, userData); // Pass userData for server-side conversion API
  }, [userData]);
  
  // Track form submissions
  const trackFormSubmission = useCallback((formName, formData = {}) => {
    // Extract user data from form submission if available
    const formUserData = {
      ...(formData.email && { email: formData.email }),
      ...(formData.firstName && { firstName: formData.firstName }),
      ...(formData.lastName && { lastName: formData.lastName }),
      ...(formData.phone && { phone: formData.phone }),
    };
    
    // Update user data if new info is available
    if (Object.keys(formUserData).length > 0) {
      updateUserData(formUserData);
    }
    
    // Track with Google Analytics
    trackClickEvent('form_submission', {
      form_name: formName,
      ...formData
    });
    
    // Also track with Facebook Pixel as Lead event
    fbEvent('Lead', {
      form_name: formName,
      content_name: formName,
      ...formData
    }, {
      ...userData,
      ...formUserData
    });
  }, [userData, updateUserData]);

  // Track outbound links
  const trackOutboundLink = useCallback((url) => {
    // Track with Google Analytics
    trackClickEvent('outbound_link', { url });
    
    // Also track with Facebook Pixel
    fbCustomEvent('outbound_link', { url }, userData);
  }, [userData]);
  
  // Track social media interactions
  const trackSocialInteraction = useCallback((network, action) => {
    // Track with Google Analytics
    trackClickEvent('social_interaction', {
      network,
      action
    });
    
    // Also track with Facebook Pixel
    fbCustomEvent('social_interaction', {
      network,
      action
    }, userData);
  }, [userData]);
  
  // Track video interactions
  const trackVideoInteraction = useCallback((videoId, action, platform = 'youtube') => {
    // Track with Google Analytics
    trackClickEvent('video_interaction', {
      video_id: videoId,
      action,
      platform
    });
    
    // Also track with Facebook Pixel
    fbCustomEvent('video_interaction', {
      video_id: videoId,
      action,
      platform
    }, userData);
  }, [userData]);

  return {
    trackEvent,
    event,
    trackFormSubmission,
    trackOutboundLink,
    trackSocialInteraction,
    trackVideoInteraction,
    updateUserData,
    userData
  };
}
