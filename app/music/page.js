import MusicPlayerEmbed from '../../components/MusicPlayerEmbed';
import Card from '../../components/Card';
import { supabase } from '../../lib/supabaseClient';

// Helper function to extract Apple Music embed ID
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

// Make the component async
export default async function Music() {
  // Log environment variables on the server-side
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded' : 'Missing');

  const { data: musicTracks, error } = await supabase
    .from('bng_music')
    .select('*')
    .order('created_at', { ascending: false });

  // Log the result from Supabase
  console.log('Fetched Music Tracks:', musicTracks);
  console.log('Supabase Error:', error);

  if (error) {
    console.error('Error fetching music:', error);
    return (
      
        <div className="container">
          <h1 className="text-center mb-4">Music</h1>
          <p className="text-center text-danger">Could not load music data.</p>
        </div>
    );
  }

  if (!musicTracks || musicTracks.length === 0) {
    return (
        <div className="container">
          <h1 className="text-center mb-4">Music</h1>
          <p className="text-center">No music found.</p>
        </div>
    );
  }

  return (
      <div className="container">
        <h1 className="text-center mb-4">Music</h1>

        <div className="mb-4">
          {musicTracks.map((track, index) => {
            const appleEmbedId = getAppleMusicEmbedId(track.apple_music_link);

            return (
              <div key={track.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card
                  title={track.title}
                  spotify_link={track.spotify_link}
                >
                  {appleEmbedId && (
                    <MusicPlayerEmbed
                      type="apple"
                      embedId={appleEmbedId}
                      title={track.title}
                    />
                  )}
                  {track.youtube_link && (
                    <div className="mt-2">
                      <a href={track.youtube_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
  );
}
