import Hero from '../components/Hero';
import Link from 'next/link';
import { artistInfo } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

// Helper function to extract Apple Music embed ID - same as in music/page.js
function getAppleMusicEmbedId(url) {
  if (!url) return null;
  try {
    const urlParts = new URL(url).pathname.split('/');
    const albumIndex = urlParts.findIndex(part => part === 'album');
    if (albumIndex !== -1 && urlParts.length > albumIndex + 1) {
      return urlParts.slice(albumIndex + 1).join('/');
    }
  } catch (e) {
    console.error("Error parsing Apple Music URL:", e);
  }
  return null;
}

// Helper function to prepare video ID - same as in videos/page.js
function prepareVideoId(id, medium) {
  if (medium && medium.toLowerCase() === 'facebook') {
    if (id && (id.startsWith('http://') || id.startsWith('https://'))) {
      return encodeURIComponent(id);
    }
    return id;
  }
  return id;
}

export default async function Home() {
  // Fetch music data - only featured tracks
  const { data: musicTracks, error: musicError } = await supabase
    .from('bng_music')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1); // Just get the latest featured track

  // Fetch video data
  const { data: videoData, error: videoError } = await supabase
    .from('bng_videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2); // Get the 2 latest videos

  // Process music data for Hero component
  const latestTrack = musicTracks && musicTracks.length > 0 ? {
    title: musicTracks[0].title,
    appleEmbedId: getAppleMusicEmbedId(musicTracks[0].apple_music_link),
    spotifyLink: musicTracks[0].spotify_link,
    coverImage: musicTracks[0].cover_image || '/images/album-cover.jpg'
  } : null;

  // Process video data for Hero component
  const featuredVideos = videoData && videoData.length > 0 ? 
    videoData.map(video => ({
      id: prepareVideoId(video.video_id, video.medium),
      platform: video.medium ? video.medium.toLowerCase() : 'youtube',
      title: video.title || 'Featured Video'
    })) : [];

  return (
    <>
      <div className="hero-container" style={{ 
        width: '100%', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Hero 
          title={artistInfo.name}
          subtitle={artistInfo.tagline}
          bgImage="/images/hero-bg.jpg"
          latestTrack={latestTrack}
          featuredVideos={featuredVideos}
        />
      </div>
      
      <section className="container mobile-padding" style={{
        padding: '2rem 1rem'
      }}>
        <div className="fade-in">
          <h2 className="text-center mb-4">Who is {artistInfo.name}?</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>
            <p 
              className="bio-paragraph" 
              dangerouslySetInnerHTML={{ __html: artistInfo.longBio }} 
            />
            
            <div className="text-center mt-4">
              <Link href="/contact" className="btn btn-mobile-full" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
              }}>
                Booking & Inquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
