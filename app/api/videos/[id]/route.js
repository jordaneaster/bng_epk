import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request, { params }) {
  const { id } = params;
  
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
  }
  
  try {
    const { data, error } = await supabase
      .from('bng_videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    // Detect platform from video_id if medium is not specified
    let medium = data.medium;
    if (!medium) {
      if (data.video_id && data.video_id.includes('instagram.com')) {
        medium = 'instagram';
      } else if (data.video_id && data.video_id.includes('facebook.com')) {
        medium = 'facebook';
      } else {
        medium = 'youtube';
      }
    }
    
    // Return with enhanced data
    return NextResponse.json({ 
      data: {
        ...data,
        description: data.description || `Watch "${data.title || 'this video'}" now`,
        medium
      } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
