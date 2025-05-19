import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Helper to detect platform from video_id
function detectPlatform(videoId) {
  if (!videoId) return 'youtube'; // Default
  
  if (videoId.includes('instagram.com')) {
    return 'instagram';
  } else if (videoId.includes('facebook.com')) {
    return 'facebook';
  } else {
    return 'youtube';
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const storyOnly = searchParams.get('story') === 'true';
  const featuredOnly = searchParams.get('featured') === 'true';
  
  try {
    let query = supabase
      .from('bng_videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if specified
    if (featuredOnly) {
      query = query.eq('featured', true);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching video data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Add description field if missing and detect platform
    const enhancedData = data.map(video => ({
      ...video,
      description: video.description || `Watch "${video.title || 'this video'}" now`,
      medium: video.medium || detectPlatform(video.video_id)
    }));
    
    return NextResponse.json({ data: enhancedData });
  } catch (error) {
    console.error('Server error fetching video data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
