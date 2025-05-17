'use client';
import { GA_TRACKING_ID } from './gtag';

// Extract property ID from the GA4 ID
const extractPropertyId = (gaId) => {
  if (!gaId) return null;
  // GA4 IDs are in the format "G-XXXXXXXXXX"
  return gaId.startsWith('G-') ? gaId.substring(2) : gaId;
};

const PROPERTY_ID = extractPropertyId(GA_TRACKING_ID);

// OAuth2 credentials
const CLIENT_ID = process.env.NEXT_PUBLIC_GA_CLIENT_ID;
const API_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

// Keep track of auth state
let isGapiLoaded = false;
let isAuthorized = false;
let loadingPromise = null;

// Load Google API client library and authenticate
const initializeAndAuthorize = async () => {
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = new Promise((resolve, reject) => {
    // Function to load the gapi client
    const loadGapiClient = () => {
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client:auth2', initClient);
        };
        script.onerror = () => reject(new Error('Failed to load Google API script'));
        document.head.appendChild(script);
      } else {
        window.gapi.load('client:auth2', initClient);
      }
    };

    // Initialize the client
    const initClient = async () => {
      try {
        await window.gapi.client.init({
          clientId: CLIENT_ID,
          scope: API_SCOPE,
          discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta']
        });
        
        isGapiLoaded = true;
        
        // Check if user is already signed in
        if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          isAuthorized = true;
          resolve();
        } else {
          // Try to sign in silently first
          try {
            await window.gapi.auth2.getAuthInstance().signIn({prompt: 'none'});
            isAuthorized = true;
            resolve();
          } catch (silentError) {
            // If silent sign-in fails, prompt user explicitly
            try {
              await window.gapi.auth2.getAuthInstance().signIn();
              isAuthorized = true;
              resolve();
            } catch (signInError) {
              reject(new Error('User declined to authorize the application'));
            }
          }
        }
      } catch (error) {
        console.error('Error initializing GAPI client', error);
        reject(error);
      }
    };

    // Start the loading process
    loadGapiClient();
  });
  
  return loadingPromise;
};

// Helper function to make authenticated API requests
const fetchFromAnalyticsApi = async (endpoint, body) => {
  try {
    await initializeAndAuthorize();
    
    const url = `https://analyticsdata.googleapis.com/v1beta${endpoint}`;
    
    // Make the request with the authorized client
    const response = await window.gapi.client.request({
      path: url,
      method: 'POST',
      body: body
    });
    
    return response.result;
  } catch (error) {
    console.error('Error making GA Data API request:', error);
    throw new Error(`Analytics API request failed: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Fetch page view data from Google Analytics Data API
 */
export const fetchGaPageViews = async (startDate, endDate) => {
  console.log(`Fetching page views from ${startDate} to ${endDate}`);
  
  if (!PROPERTY_ID) {
    throw new Error('Google Analytics property ID not found');
  }
  
  try {
    const requestBody = {
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        }
      ],
      dimensions: [
        {
          name: 'pagePath',
        }
      ],
      metrics: [
        {
          name: 'screenPageViews',
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 10,
    };
    
    const data = await fetchFromAnalyticsApi(`/properties/${PROPERTY_ID}:runReport`, requestBody);
    
    // Transform the response to match our expected format
    return data.rows?.map(row => ({
      name: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching page views from GA Data API:', error);
    throw error;
  }
};

/**
 * Fetch event data from Google Analytics Data API
 */
export const fetchGaEvents = async (startDate, endDate) => {
  console.log(`Fetching events from ${startDate} to ${endDate}`);
  
  if (!PROPERTY_ID) {
    throw new Error('Google Analytics property ID not found');
  }
  
  try {
    const requestBody = {
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        }
      ],
      dimensions: [
        {
          name: 'eventName',
        }
      ],
      metrics: [
        {
          name: 'eventCount',
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: 'eventCount',
          },
          desc: true,
        },
      ],
      limit: 10,
    };
    
    const data = await fetchFromAnalyticsApi(`/properties/${PROPERTY_ID}:runReport`, requestBody);
    
    // Transform the response to match our expected format
    return data.rows?.map(row => ({
      name: row.dimensionValues[0].value,
      count: parseInt(row.metricValues[0].value, 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching events from GA Data API:', error);
    throw error;
  }
};

/**
 * Fetch referral data from Google Analytics Data API
 */
export const fetchGaReferrals = async (startDate, endDate) => {
  console.log(`Fetching referrals from ${startDate} to ${endDate}`);
  
  if (!PROPERTY_ID) {
    throw new Error('Google Analytics property ID not found');
  }
  
  try {
    const requestBody = {
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        }
      ],
      dimensions: [
        {
          name: 'sessionSource',
        }
      ],
      metrics: [
        {
          name: 'sessions',
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: 'sessions',
          },
          desc: true,
        },
      ],
      limit: 6,
    };
    
    const data = await fetchFromAnalyticsApi(`/properties/${PROPERTY_ID}:runReport`, requestBody);
    
    // Transform the response to match our expected format
    return data.rows?.map(row => ({
      name: row.dimensionValues[0].value || '(direct)',
      value: parseInt(row.metricValues[0].value, 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching referrals from GA Data API:', error);
    throw error;
  }
};

// Sign out from Google
export const signOutFromGoogle = () => {
  if (isGapiLoaded && window.gapi && window.gapi.auth2) {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signOut();
      isAuthorized = false;
    }
  }
};

// Fallback mock data in case the API fails
export const mockPageViews = [
  { name: '/home', views: 1250 },
  { name: '/videos', views: 880 },
  { name: '/music', views: 750 },
  { name: '/about', views: 620 },
  { name: '/contact', views: 410 },
];

export const mockEventCounts = [
  { name: 'video_play', count: 325 },
  { name: 'social_follow', count: 210 },
  { name: 'download_epk', count: 130 },
  { name: 'music_listen', count: 280 },
];

export const mockReferrals = [
  { name: 'Direct', value: 40 },
  { name: 'Google', value: 25 },
  { name: 'Facebook', value: 15 },
  { name: 'Instagram', value: 10 },
  { name: 'Twitter', value: 5 },
  { name: 'Other', value: 5 },
];
