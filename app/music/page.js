import MusicPlayerEmbed from '../../components/MusicPlayerEmbed';
import { supabase } from '../../lib/supabaseClient';
import Script from 'next/script';
import { createBaseMetadata } from '../../lib/seo';
import { FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';

export const metadata = createBaseMetadata({
  title: 'Music - BNG NappSakk | Discography',
  description: 'Stream the latest releases, albums, and singles from BNG NappSakk. Available on Spotify, Apple Music, YouTube, and more.',
  path: '/music',
  ogImage: '/images/bape-cover.jpg',
});

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

export default async function Music() {
  const { data: musicTracks, error } = await supabase
    .from('bng_music')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="music-page">
        <div className="music-hero"><div className="container"><h1>Discography</h1></div></div>
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          Could not load music data.
        </div>
        <style dangerouslySetInnerHTML={{ __html: musicStyles }} />
      </div>
    );
  }

  if (!musicTracks || musicTracks.length === 0) {
    return (
      <div className="music-page">
        <div className="music-hero"><div className="container"><h1>Discography</h1></div></div>
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          No music found. Check back soon.
        </div>
        <style dangerouslySetInnerHTML={{ __html: musicStyles }} />
      </div>
    );
  }

  const sortedTracks = [...musicTracks].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'BNG NappSakk - Discography',
    numTracks: sortedTracks.length,
    track: sortedTracks.map((track, index) => ({
      '@type': 'MusicRecording',
      name: track.title,
      position: index + 1,
      url: track.spotify_link || '',
    })),
  };

  return (
    <div className="music-page">
      <Script
        id="schema-music"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="music-hero">
        <div className="container">
          <span className="hero-label">Discography</span>
          <h1>The <span className="text-gradient-gold">Music</span></h1>
          <p className="hero-sub">Stream everywhere. Support independent.</p>
        </div>
      </section>

      {/* All Releases */}
      <section className="releases-section">
        <div className="container">
          <div className="releases-grid">
            {sortedTracks.map((track, index) => {
              const appleEmbedId = getAppleMusicEmbedId(track.apple_music_link);
              return (
                <div key={track.id} className="release-card" style={{ animationDelay: `${index * 0.12}s` }}>
                  <span className="release-badge">{track.featured ? 'Latest Release' : 'Single'}</span>

                  <h2 className="release-title">{track.title}</h2>
                  {track.description && <p className="release-desc">{track.description}</p>}

                  {/* Embedded Player */}
                  {appleEmbedId && (
                    <div className="release-player">
                      <MusicPlayerEmbed type="apple" embedId={appleEmbedId} title={track.title} />
                    </div>
                  )}

                  {/* Streaming Links */}
                  <div className="stream-links">
                    {track.spotify_link && (
                      <a href={track.spotify_link} target="_blank" rel="noopener noreferrer" className="stream-btn spotify">
                        <FaSpotify /> Spotify
                      </a>
                    )}
                    {track.apple_music_link && (
                      <a href={track.apple_music_link} target="_blank" rel="noopener noreferrer" className="stream-btn apple">
                        <FaApple /> Apple Music
                      </a>
                    )}
                    {track.youtube_link && (
                      <a href={track.youtube_link} target="_blank" rel="noopener noreferrer" className="stream-btn youtube">
                        <FaYoutube /> YouTube
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: musicStyles }} />
    </div>
  );
}

const musicStyles = `
  .music-page {
    background: #0a0a0a;
    min-height: 100vh;
  }

  /* Hero */
  .music-hero {
    padding: 8rem 0 3rem;
    text-align: center;
    background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
    position: relative;
  }
  .music-hero::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
  }
  .hero-label {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-primary, #f0b429);
    margin-bottom: 0.75rem;
  }
  .music-hero h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.5rem;
    line-height: 1;
  }
  .hero-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.45);
    margin: 0;
  }

  /* Releases Section */
  .releases-section {
    padding: 4rem 0 5rem;
  }
  .releases-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
    max-width: 900px;
    margin: 0 auto;
  }

  /* Release Card */
  .release-card {
    background: #141414;
    border-radius: 16px;
    padding: 1.75rem;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    animation: fadeInUp 0.5s ease both;
    position: relative;
  }
  .release-card:hover {
    transform: translateY(-4px);
    border-color: rgba(240,180,41,0.15);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Badge */
  .release-badge {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-primary, #f0b429);
    background: rgba(240,180,41,0.1);
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  /* Info */
  .release-title {
    font-size: clamp(1.25rem, 3vw, 1.6rem);
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }
  .release-desc {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.5);
    margin: 0 0 1.25rem;
  }

  /* Embedded Player */
  .release-player {
    width: 100%;
    margin-bottom: 1.25rem;
    border-radius: 8px;
    overflow: hidden;
  }

  /* Streaming Links */
  .stream-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
    margin-top: auto;
  }
  .stream-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.08);
    color: #fff;
    background: rgba(255,255,255,0.04);
  }
  .stream-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .stream-btn.spotify:hover { background: rgba(30,215,96,0.15); border-color: rgba(30,215,96,0.3); }
  .stream-btn.apple:hover { background: rgba(252,60,68,0.15); border-color: rgba(252,60,68,0.3); }
  .stream-btn.youtube:hover { background: rgba(255,0,0,0.15); border-color: rgba(255,0,0,0.3); }

  @media (max-width: 768px) {
    .music-hero { padding: 6.5rem 0 2rem; }
    .releases-grid {
      grid-template-columns: 1fr;
      max-width: 420px;
    }
  }
  @media (max-width: 480px) {
    .music-hero h1 { font-size: 2rem; }
    .release-card { padding: 1.25rem; }

  }
`;
