import VideoEmbed from '../../components/VideoEmbed';
import Card from '../../components/Card'; // Optional: Use Card for consistent styling
import { supabase } from '../../lib/supabaseClient';
import Script from 'next/script';
import { createBaseMetadata } from '../../lib/seo';

// Export metadata for this page
export const metadata = createBaseMetadata({
  title: 'Videos - BNG Music',
  description: 'Watch the latest music videos, live performances, and more from BNG Music.',
  path: '/videos',
  ogImage: '/images/videos-og.jpg',
});

// Helper function to prepare video ID (handles Facebook URL encoding)
function prepareVideoId(id, medium) {
  if (medium && medium.toLowerCase() === 'facebook') {
    // Assume 'id' contains the full raw Facebook URL, encode it
    try {
      // Basic check if it looks like a URL before encoding
      if (id && (id.startsWith('http://') || id.startsWith('https://'))) {
        return encodeURIComponent(id);
      } else {
        console.warn(`Facebook video_id "${id}" does not look like a URL. Skipping encoding.`);
        return id; // Return as is if it doesn't look like a URL
      }
    } catch (e) {
      console.error("Error encoding Facebook URL:", e);
      return null; // Return null if encoding fails
    }
  }
  // For other platforms, return the ID as is
  return id;
}

// Make the component async
export default async function Videos() {
  const { data: videoData, error } = await supabase
    .from('bng_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return (
        <div className="container">
          <h1 className="text-center mb-4">Videos</h1>
          <p className="text-center text-danger">Could not load video data.</p>
        </div>
    );
  }

  if (!videoData || videoData.length === 0) {
    return (
        <div className="container">
          <h1 className="text-center mb-4">Videos</h1>
          <p className="text-center">No videos found.</p>
        </div>
    );
  }

  // Create VideoObject structured data for the first video
  const firstVideo = videoData && videoData.length > 0 ? videoData[0] : null;
  const structuredData = firstVideo ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: firstVideo.title || 'BNG Music Video',
    description: 'Music video by BNG Music',
    thumbnailUrl: firstVideo.thumbnail_url || 'https://bngmusicentertainment.com/images/bape-cover.jpg',
    uploadDate: firstVideo.created_at || new Date().toISOString(),
    contentUrl: firstVideo.video_url || '',
  } : null;

  return (
    <>
      {structuredData && (
        <Script
          id="schema-video"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className="container">
        <div className="mb-4">
          {videoData.map((video, index) => {
            const platform = video.medium ? video.medium.toLowerCase() : 'youtube'; // Default to youtube if medium is null
            const preparedVideoId = prepareVideoId(video.video_id, platform);

            // Skip rendering if video ID preparation failed
            if (!preparedVideoId) {
              console.warn(`Skipping video with original ID: ${video.video_id} due to processing error.`);
              return null;
            }

            // Use Card component for consistent styling
            return (
              <div key={video.id} className="fade-in mb-4" style={{ animationDelay: `${index * 0.1}s` }}>
                 <Card title={video.title || ''}> {/* Use video.title if it exists */}
                   <VideoEmbed
                     platform={platform}
                     videoId={preparedVideoId}
                     title={video.title || `${platform} Video`} // Use a title field if available
                   />
                 </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
