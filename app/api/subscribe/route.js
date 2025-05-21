import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    // Parse the request body
    const { email, firstName = null, interests = ['music'] } = await request.json();

    // Validate email (basic validation)
    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid email address'
      }, { status: 400 });
    }

    // Check if email already exists in the subscriptions table
    const { data: existingSubscriber, error: lookupError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('Error checking for existing subscriber:', lookupError);
      return NextResponse.json({ 
        success: false, 
        message: 'Error processing your request'
      }, { status: 500 });
    }

    // If subscriber exists, return success (don't tell user they're already subscribed for privacy)
    if (existingSubscriber) {
      return NextResponse.json({ 
        success: true,
        message: 'Subscription successful!'
      });
    }

    // Format today's date as YYYY-MM-DD for the date column
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Add new subscriber using the existing subscriptions table structure
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert([
        { 
          email,
          first_name: firstName,
          subscribed_at: formattedDate, // Using date format as per your table
          interests // Using the interests array field
        }
      ]);

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return NextResponse.json({ 
        success: false, 
        message: 'Error processing your subscription' 
      }, { status: 500 });
    }

    // Send welcome email (would typically be handled by a service like SendGrid)
    // This would be implemented separately based on your email provider

    return NextResponse.json({ 
      success: true,
      message: 'Subscription successful!'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
