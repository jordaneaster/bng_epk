import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, preferences } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' }, 
        { status: 400 }
      );
    }
    
    // Convert preferences object to array of interests
    const interests = [];
    if (preferences) {
      Object.entries(preferences).forEach(([key, value]) => {
        if (value === true) {
          interests.push(key);
        }
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseServiceKey 
      });
      throw new Error('Server configuration error');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Format data for database
    const subscriptionData = {
      email: email.toLowerCase().trim(),
      first_name: name ? name.trim() : null,
      interests: interests,
      subscribed_at: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
    
    // Check if email already exists to prevent duplicates
    const { data: existingSubscription, error: lookupError } = await supabase
      .from('subscriptions')
      .select('id, email')
      .eq('email', subscriptionData.email)
      .maybeSingle();
    
    if (lookupError) {
      console.error('Error checking for existing subscription:', lookupError);
      throw new Error('Database error when checking for existing subscription');
    }
    
    let result;
    
    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          first_name: subscriptionData.first_name,
          interests: subscriptionData.interests
        })
        .eq('id', existingSubscription.id);
      
      if (error) {
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
      }
      
      result = { 
        message: 'Subscription updated successfully',
        updated: true
      };
    } else {
      // Insert new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData]);
      
      if (error) {
        console.error('Error inserting subscription:', error);
        throw new Error('Failed to insert subscription');
      }
      
      result = { 
        message: 'Subscribed successfully',
        subscribed: true
      };
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe to mailing list. Please try again.' }, 
      { status: 500 }
    );
  }
}
