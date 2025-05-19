import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  
  try {
    let query = supabase
      .from('bng_music')
      .select('*')
      .order('created_at', { ascending: false });
      
    // Apply filters
    if (featured) {
      query = query.eq('featured', true);
    }
    
    // Apply limit
    query = query.limit(limit);
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching music data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Server error fetching music data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
