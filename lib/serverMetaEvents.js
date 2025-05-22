import crypto from 'crypto';

// Assign environment variables
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const API_VERSION = 'v18.0'; // Update this as needed

// Hash user data for privacy
function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}

// Process user data for Meta Conversions API
export function processUserData(userData) {
  const processed = {};

  if (userData.email) {
    processed.em = hashData(userData.email.trim().toLowerCase());
  }
  
  if (userData.phone) {
    // Remove all non-numeric characters
    const cleanPhone = userData.phone.replace(/\D/g, '');
    processed.ph = hashData(cleanPhone);
  }
  
  if (userData.firstName && userData.lastName) {
    processed.fn = hashData(userData.firstName.trim().toLowerCase());
    processed.ln = hashData(userData.lastName.trim().toLowerCase());
  }
  
  if (userData.city) {
    processed.ct = hashData(userData.city.trim().toLowerCase());
  }
  
  if (userData.state) {
    processed.st = hashData(userData.state.trim().toLowerCase());
  }
  
  if (userData.zip) {
    processed.zp = hashData(userData.zip.trim());
  }
  
  if (userData.country) {
    processed.country = hashData(userData.country.trim().toLowerCase());
  }
  
  // External ID (if available)
  if (userData.externalId) {
    processed.external_id = hashData(userData.externalId);
  }
  
  return processed;
}

// Generate a timestamp in the format required by Meta
export function generateTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// Generate a random UUID for event deduplication
export function generateEventId() {
  return crypto.randomUUID();
}

// Send server event directly to Meta Conversions API
export async function sendServerEvent({
  eventName,
  eventId = generateEventId(),
  userData = {},
  customData = {},
  eventSourceUrl,
  actionSource = 'website',
  ipAddress,
  userAgent,
}) {
  // Return early if access token or pixel ID is missing
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.warn('Meta Conversions API is not configured. Missing access token or pixel ID.');
    return { success: false, message: 'Meta Conversions API is not configured' };
  }
  
  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
  
  try {
    // Process user data and create the event object
    const processedUserData = processUserData(userData);
    
    const event = {
      event_name: eventName,
      event_time: generateTimestamp(),
      action_source: actionSource,
      event_id: eventId,
      event_source_url: eventSourceUrl,
      user_data: {
        client_ip_address: ipAddress,
        client_user_agent: userAgent,
        ...processedUserData,
      },
      custom_data: customData || {},
    };
    
    // Send the event to Meta
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
        access_token: ACCESS_TOKEN,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Unknown error from Meta API');
    }
    
    return {
      success: true,
      fbResponse: data,
      eventId: event.event_id,
    };
  } catch (error) {
    console.error('Error sending server event to Meta:', error);
    return {
      success: false,
      message: error.message || 'Unknown error',
    };
  }
}
