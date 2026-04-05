import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function normalizeInterests(interests, preferences, queueItemId) {
  if (Array.isArray(interests) && interests.length > 0) {
    return [...new Set(interests.filter(Boolean))];
  }

  if (preferences && typeof preferences === 'object') {
    const normalizedPreferences = Object.entries(preferences)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key);

    if (normalizedPreferences.length > 0) {
      return [...new Set(normalizedPreferences)];
    }
  }

  return queueItemId ? ['merch'] : ['music'];
}

export async function POST(request) {
  try {
    // Parse the request body
    const {
      email,
      firstName = null,
      interests,
      preferences = null,
      source = 'website-subscribe',
      queueItemId = null,
      queueItemName = null,
    } = await request.json();

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedInterests = normalizeInterests(interests, preferences, queueItemId);

    // Validate email (basic validation)
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid email address'
      }, { status: 400 });
    }

    // Check if email already exists in the subscriptions table
    const { data: existingSubscriber, error: lookupError } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error processing your request'
      }, { status: 500 });
    }

    // Format today's date as YYYY-MM-DD for the date column
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    let subscriberId = existingSubscriber?.id ?? null;

    if (!existingSubscriber) {
      const { data: insertedSubscriber, error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert([
          {
            email: normalizedEmail,
            first_name: firstName,
            subscribed_at: formattedDate,
            interests: normalizedInterests,
          },
        ])
        .select('id')
        .single();

      if (insertError) {
        return NextResponse.json({ 
          success: false, 
          message: 'Error processing your subscription' 
        }, { status: 500 });
      }

      subscriberId = insertedSubscriber?.id ?? null;
    }

    if (queueItemId && queueItemName) {
      const { error: queueInsertError } = await supabaseAdmin
        .from('presale_queue_entries')
        .insert([
          {
            email: normalizedEmail,
            first_name: firstName,
            queue_item_id: queueItemId,
            queue_item_name: queueItemName,
            source,
            subscriber_id: subscriberId,
            interests: normalizedInterests,
            metadata: {
              preferences,
            },
          },
        ]);

      if (queueInsertError) {
        return NextResponse.json({
          success: false,
          message: 'Unable to join the presale queue right now',
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: queueItemId ? 'Presale queue entry saved!' : 'Subscription successful!'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
