import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  
  try {
    // Use the public_blog view we created in our SQL script
    // This only returns published posts and includes author information
    const { data, error } = await supabase
      .from('public_blog')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Return the blog posts
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
