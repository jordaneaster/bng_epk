import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

// Configure email transporter - only create if environment variables are set
let transporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      debug: process.env.EMAIL_DEBUG === 'true',
      logger: process.env.EMAIL_DEBUG === 'true',
    });
  } catch (error) {
    console.error('Error setting up email transporter:', error);
  }
}

// Function to add a subscriber to the Mailgun mailing list
async function addSubscriberToMailingList(name, email) {
  if (!process.env.EMAIL_MAILING_LIST) {
    return { success: false, message: 'Mailing list not configured' };
  }
  
  const listParts = process.env.EMAIL_MAILING_LIST.split('@');
  const listName = listParts[0];
  const domain = listParts[1];
  
  if (!domain || !listName) {
    return { success: false, message: 'Invalid mailing list format' };
  }
  
  try {
    const url = `https://api.mailgun.net/v3/lists/${process.env.EMAIL_MAILING_LIST}/members`;
    const apiKey = process.env.MAILGUN_API_KEY;
    if (!apiKey) {
      return { success: false, message: 'Mailgun API key not configured' };
    }
    
    const auth = Buffer.from(`api:${apiKey}`).toString('base64');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        subscribed: 'yes',
        address: email,
        name: name || email.split('@')[0], // Use part of email as name if not provided
        vars: JSON.stringify({ source: 'footer-form' })
      }).toString()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: 'Successfully added to mailing list', data };
    } else {
      console.error('Error adding to mailing list:', data);
      return { success: false, message: data.message || 'Failed to add to mailing list' };
    }
  } catch (error) {
    console.error('Exception adding to mailing list:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    // Store in Supabase
    const { data: existingEmails, error: checkError } = await supabase
      .from('mailing_list')
      .select('email')
      .eq('email', email);

    if (checkError) {
      console.error('Supabase check error:', checkError);
    }

    // If email doesn't exist in database, add it
    if (!existingEmails || existingEmails.length === 0) {
      const { error } = await supabase
        .from('mailing_list')
        .insert([{ email, name: name || '' }]);

      if (error) {
        console.error('Supabase insert error:', error);
        // Continue with Mailgun even if Supabase fails
      }
    }

    // Use the existing mailing list subscription functionality
    const result = await addSubscriberToMailingList(name, email);
    
    if (result.success) {
      // Send confirmation email if transporter is configured
      if (transporter && process.env.EMAIL_FROM) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Subscription Confirmation - BNG Music',
            html: `
              <h2>Thanks for subscribing!</h2>
              <p>You've successfully joined our mailing list. We'll keep you updated on our latest news and events.</p>
              <p>- BNG NappSakk Team</p>
            `
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Successfully subscribed to our mailing list!'
      });
    } else {
      console.error('Mailing list subscription failed:', result.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to subscribe to mailing list. Please try again.' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    }, { status: 500 });
  }
}
