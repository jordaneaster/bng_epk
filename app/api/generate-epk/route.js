import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { artistInfo } from '../../../data/mockData';

export async function GET() {
  try {
    // Fetch music data
    const { data: musicData, error: musicError } = await supabase
      .from('bng_music')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (musicError) throw new Error(`Music data error: ${musicError.message}`);

    // Fetch video data
    const { data: videoData, error: videoError } = await supabase
      .from('bng_videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (videoError) throw new Error(`Video data error: ${videoError.message}`);

    // Fetch image URLs - increased limit to 20
    const bucketName = 'gallery-images';
    const folderPath = 'bng';

    const { data: fileList, error: listError } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath, {
        limit: 20, // Increased from 10 to 20 to ensure we get enough images
        sortBy: { column: 'name', order: 'asc' },
      });
    
    if (listError) throw new Error(`Image list error: ${listError.message}`);

    // Process image URLs
    const imageUrls = fileList 
      ? fileList
          .filter(file => !file.name.startsWith('.'))
          .map(file => {
            const { data } = supabase
              .storage
              .from(bucketName)
              .getPublicUrl(`${folderPath}/${file.name}`);
            
            return data?.publicUrl || null;
          })
          .filter(url => url !== null)
      : [];

    // Return the data needed for PDF generation
    return NextResponse.json({
      success: true,
      data: {
        artist: artistInfo,
        music: musicData || [],
        videos: videoData || [],
        images: imageUrls || [],
      }
    });
  } catch (error) {
    console.error("Error generating EPK data:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error generating EPK data"
    }, { status: 500 });
  }
}
