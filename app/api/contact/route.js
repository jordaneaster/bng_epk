import { NextResponse } from 'next/server';
// Import the Supabase client creator
import { createClient } from '@supabase/supabase-js';

// No need for the pg Pool or saveContactSubmission function anymore

export async function POST(request) {
  // Create a Supabase client instance using environment variables
  // IMPORTANT: Use the Service Role Key here to bypass RLS for server-side insertion.
  // Ensure these variables are correctly set in your .env.local file.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Key is missing in environment variables.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  // Create the client instance for THIS request.
  // It's generally recommended to create it per request in serverless environments.
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // Prevent Supabase from trying to manage sessions for the service key
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    }
  });

  try {
    const data = await request.json();

    // Basic validation (keep existing validation)
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Add more robust validation (e.g., email format, length checks)

    // Insert data into the 'contact_submissions' table using Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions') // Your table name
      .insert([
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          // 'submitted_at' should be handled by the database default value
        },
      ])
      .select(); // Optionally select the inserted data

    if (insertError) {
      // Throw an error if Supabase returned an error
      throw new Error(insertError.message || 'Failed to save submission to the database.');
    }


    // Return success response
    // Adjust the response data as needed, maybe return the ID if available in insertData
    return NextResponse.json({ message: 'Submission received!', data: insertData?.[0] }, { status: 201 });

  } catch (error) {
    // Return a more specific error if it came from the database function
    const errorMessage = error.message.includes('database') || error.message.includes('relation') // Check for common DB error messages
      ? 'Could not save submission.'
      : 'Internal Server Error';

    return NextResponse.json({ message: errorMessage, error: error.message }, { status: 500 });
  }
}
