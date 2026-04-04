import VideoEmbed from '../../components/VideoEmbed';
import { supabase } from '../../lib/supabaseClient';
import Script from 'next/script';
import { createBaseMetadata } from '../../lib/seo';

export const metadata = createBaseMetadata({
  title: 'Videos - BNG NappSakk | Music Videos & Performances',
  description: 'Watch the latest music videos, live performances, freestyles, and behind-the-scenes content from BNG NappSakk.',
  path: '/videos',
  ogImage: '/images/videos-og.jpg',
});

function prepareVideoId(id, medium) {
  if (medium && medium.toLowerCase() === 'facebook') {
    try {
      if (id && (id.startsWith('http://') || id.startsWith('https://'))) {
        return encodeURIComponent(id);
      }
      return id;
    } catch (e) {
      return null;
    }
  }
  return id;
}

export default async function Videos() {
  const { data: videoData, error } = await supabase
    .from('bng_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !videoData || videoData.length === 0) {
    return (
      <div className="videos-page">
        <section className="videos-hero"><div className="container"><span className="hero-label">Visual</span><h1>The <span className="text-gradient-gold">Videos</span></h1></div></section>
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          {error ? 'Could not load video data.' : 'No videos found. Check back soon.'}
        </div>
        <style dangerouslySetInnerHTML={{ __html: videoStyles }} />
      </div>
    );
  }

  const featuredVideo = videoData[0];
  const remainingVideos = videoData.slice(1);
  const featuredPlatform = featuredVideo.medium ? featuredVideo.medium.toLowerCase() : 'youtube';
  const featuredId = prepareVideoId(featuredVideo.video_id, featuredPlatform);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: featuredVideo.title || 'BNG NappSakk Music Video',
    description: 'Music video by BNG NappSakk',
    thumbnailUrl: featuredVideo.thumbnail_url || 'https://bngmusicentertainment.com/images/bape-cover.jpg',
    uploadDate: featuredVideo.created_at || new Date().toISOString(),
    contentUrl: featuredVideo.video_url || '',
  };

  return (
    <div className="videos-page">
      <Script
        id="schema-video"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="videos-hero">
        <div className="container">
          <span className="hero-label">Visual</span>
          <h1>The <span className="text-gradient-gold">Videos</span></h1>
          <p className="hero-sub">Music videos, live performances & behind the scenes.</p>
        </div>
      </section>

      {/* Featured Video */}
      {featuredId && (
        <section className="featured-video-section">
          <div className="container">
            <div className="featured-video-wrap">
              <VideoEmbed
                platform={featuredPlatform}
                videoId={featuredId}
                title={featuredVideo.title || 'Featured Video'}
              />
            </div>
            <div className="featured-video-info">
              <span className="featured-badge">Now Playing</span>
              <h2>{featuredVideo.title}</h2>
              {featuredVideo.description && <p>{featuredVideo.description}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Video Grid */}
      {remainingVideos.length > 0 && (
        <section className="videos-grid-section">
          <div className="container">
            <h2 className="section-heading">All <span className="text-gradient-gold">Videos</span></h2>
            <div className="videos-grid">
              {remainingVideos.map((video, index) => {
                const platform = video.medium ? video.medium.toLowerCase() : 'youtube';
                const preparedId = prepareVideoId(video.video_id, platform);
                if (!preparedId) return null;

                return (
                  <div key={video.id} className="video-card" style={{ animationDelay: `${index * 0.08}s` }}>
                    <div className="video-embed-wrap">
                      <VideoEmbed
                        platform={platform}
                        videoId={preparedId}
                        title={video.title || `${platform} Video`}
                      />
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      {video.description && <p>{video.description}</p>}
                      <span className="video-platform">{platform}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: videoStyles }} />
    </div>
  );
}

const videoStyles = `
  .videos-page {
    background: #0a0a0a;
    min-height: 100vh;
  }

  .videos-hero {
    padding: 8rem 0 3rem;
    text-align: center;
    background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
    position: relative;
  }
  .videos-hero::after {
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
  .videos-hero h1 {
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

  /* Featured Video */
  .featured-video-section {
    padding: 3rem 0 2rem;
  }
  .featured-video-wrap {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    max-width: 960px;
    margin: 0 auto;
  }
  .featured-video-info {
    text-align: center;
    padding: 1.5rem 0;
    max-width: 700px;
    margin: 0 auto;
  }
  .featured-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #ff3c00;
    background: rgba(255,60,0,0.1);
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 0.75rem;
  }
  .featured-video-info h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
  }
  .featured-video-info p {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }

  /* Grid */
  .videos-grid-section {
    padding: 3rem 0 5rem;
    background: #0d0d0d;
  }
  .section-heading {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 2.5rem;
    color: #fff;
  }
  .videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
    gap: 1.5rem;
  }
  .video-card {
    background: #141414;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.04);
    transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    animation: fadeInUp 0.5s ease both;
  }
  .video-card:hover {
    transform: translateY(-4px);
    border-color: rgba(240,180,41,0.12);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .video-embed-wrap {
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  .video-info {
    padding: 1.25rem;
  }
  .video-info h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.3rem;
  }
  .video-info p {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.45);
    margin: 0 0 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .video-platform {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.25);
  }

  @media (max-width: 1024px) {
    .videos-grid {
      grid-template-columns: 1fr;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  @media (max-width: 480px) {
    .videos-hero { padding: 6.5rem 0 2rem; }
    .videos-hero h1 { font-size: 2rem; }
  }
`;
