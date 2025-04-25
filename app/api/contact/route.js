import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    console.log(`Email transport configured with user: ${process.env.EMAIL_USER}`);
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
        name: name,
        vars: JSON.stringify({ source: 'contact-form' })
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
    const data = await request.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, subject, message }]);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to save contact' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let emailStatus = 'Not attempted';
    let emailDetails = {};
    let mailingListStatus = 'Not attempted';

    if (transporter) {
      try {
        const recipients = process.env.EMAIL_RECIPIENT;
        
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: recipients,
          replyTo: email,
          subject: `New Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        };
        
        console.log(`Attempting to send email from: ${mailOptions.from} to: ${mailOptions.to}`);
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sending result:', info);
        
        emailStatus = 'Sent successfully';
        emailDetails = {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted || [],
          rejected: info.rejected || []
        };
        
        if (info.rejected && info.rejected.length > 0) {
          emailStatus = `Partially delivered (${info.accepted.length}/${info.accepted.length + info.rejected.length} recipients)`;
        }
        
        if (process.env.EMAIL_MAILING_LIST && process.env.MAILGUN_API_KEY) {
          try {
            const result = await addSubscriberToMailingList(name, email);
            mailingListStatus = result.success 
              ? `Added to mailing list: ${result.message}` 
              : `Failed to add to list: ${result.message}`;
            
            console.log('Mailing list subscription result:', result);
            
            const mailingListOptions = {
              from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
              to: process.env.EMAIL_MAILING_LIST,
              replyTo: email,
              subject: `New Contact Form Submission from ${name}`,
              html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
                <hr>
                <p><small>This email was sent to the mailing list from the contact form on bngmusicentertainment.com</small></p>
              `,
              headers: {
                'X-Mailgun-Variables': JSON.stringify({
                  source: 'contact-form',
                  contactName: name,
                  contactEmail: email
                })
              }
            };
            
            console.log(`Sending to mailing list: ${process.env.EMAIL_MAILING_LIST}`);
            const listInfo = await transporter.sendMail(mailingListOptions);
            mailingListStatus += ' and notification sent to existing subscribers';
            console.log('Mailing list sending result:', listInfo);
          } catch (listError) {
            console.error('Failed to handle mailing list operations:', listError);
            mailingListStatus = `Mailing list error: ${listError.message}`;
          }
        }
        
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        console.error('Email configuration:', {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          user: process.env.EMAIL_USER,
          from: process.env.EMAIL_FROM,
        });
        emailStatus = `Failed: ${emailError.message}`;
        emailDetails = { error: emailError.message };
      }
    } else {
      console.log('Email transport not configured, skipping notification email');
      emailStatus = 'Transport not configured';
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully saved contact information',
        emailStatus: emailStatus,
        mailingListStatus: mailingListStatus,
        emailDetails: emailDetails
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({ message: 'Error processing request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
