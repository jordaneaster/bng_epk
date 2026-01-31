import { NextResponse } from 'next/server';
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
function processUserData(userData) {
  const processed = {};

  if (!userData) return processed;

  try {
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
  } catch (error) {
  }
  
  return processed;
}

// Generate a timestamp in the format required by Meta
function generateTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// Send event to Meta Conversions API
async function sendEventToMeta(eventData) {
  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: ACCESS_TOKEN,
      }),
    });
    
    // Handle network issues
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || 'Unknown Facebook API error';
      } catch (e) {
        errorMessage = errorText || `HTTP error ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Handle POST requests
export async function POST(request) {
  try {
    // Return early if access token or pixel ID is missing
    if (!ACCESS_TOKEN || !PIXEL_ID) {
      return NextResponse.json({
        success: false,
        message: 'Meta Conversions API is not configured',
      }, { status: 503 });
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body',
      }, { status: 400 });
    }
    
    // Extract data from request
    const { 
      eventName, 
      eventId, 
      userData, 
      customData,
      eventSourceUrl,
      actionSource = 'website'
    } = body;
    
    // Validate required fields
    if (!eventName) {
      return NextResponse.json({
        success: false,
        message: 'Missing eventName',
      }, { status: 400 });
    }
    
    // Process data for the event
    const processedUserData = processUserData(userData);
    
    // Construct the event object
    const event = {
      event_name: eventName,
      event_time: generateTimestamp(),
      action_source: actionSource,
      event_id: eventId || crypto.randomUUID(),
      event_source_url: eventSourceUrl,
      user_data: {
        client_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        client_user_agent: request.headers.get('user-agent'),
        ...processedUserData,
      },
      custom_data: customData || {},
    };
    
    // Send event to Meta
    const result = await sendEventToMeta(event);
    
    // Return success response
    return NextResponse.json({
      success: true,
      fbResponse: result,
      eventId: event.event_id,
    });
  } catch (error) {
    
    // Return error response
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
