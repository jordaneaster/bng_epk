"use client";

import CinematicHero from '@/components/CinematicHero';
import CredibilityBanner from '@/components/CredibilityBanner';
import VideoEmbed from '@/components/VideoEmbed';
import AnimateOnScroll from '@/components/motion/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { artistInfo } from '@/data/mockData';
import { useEffect, useState, useMemo } from 'react';
import Script from 'next/script';
import { createMusicGroupSchema } from '@/lib/seo';
import { FaSpotify, FaApple, FaYoutube, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaPlay } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight, lineGrow } from '@/lib/animations';

// Since this is now a Client Component, we need to fetch data client-side
export default function Home() {
  const [musicTracks, setMusicTracks] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [storyVideos, setStoryVideos] = useState(null);
  const [blogPosts, setBlogPosts] = useState(null);
  const [nextShow, setNextShow] = useState(null); // State for the next show
  const [premiereVideo, setPremiereVideo] = useState(null); // New state for premiere video
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Format date for blog posts
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch music data
        const musicResponse = await fetch('/api/music?featured=true&limit=1');
        const musicData = await musicResponse.json();
        
        // Fetch video data for the featured video section (3 videos)
        const videoResponse = await fetch('/api/videos?limit=3');
        const videoDataResult = await videoResponse.json(); // Renamed to avoid conflict
        
        // Fetch more videos for the story section (5 videos)
        const storyResponse = await fetch('/api/videos?limit=10');
        const storyData = await storyResponse.json();
        
        // Fetch blog posts
        const blogResponse = await fetch('/api/blog?limit=3');
        let blogData;
        
        try {
          blogData = await blogResponse.json();
        } catch (error) {
          // If API endpoint doesn't exist yet, create a fallback
          blogData = { data: [] };
        }

        // Fetch next upcoming show
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const { data: liveEventsData, error: liveEventsError } = await supabase
          .from('live_events')
          .select('*')
          .gte('date', currentDate) // Only get events on or after today
          .order('date', { ascending: true })
          .limit(1);

        if (liveEventsError) {
        } else if (liveEventsData && liveEventsData.length > 0) {
          setNextShow(liveEventsData[0]);
        }
        
        // Fetch premiere video - assuming there's a "premiere" field to identify it
        const { data: premiereData, error: premiereError } = await supabase
          .from('bng_videos')
          .select('*')
          .eq('is_premiere', true)
          .order('premiere_date', { ascending: true })
          .limit(1);
          
        if (premiereError) {
        } else if (premiereData && premiereData.length > 0) {
          setPremiereVideo(premiereData[0]);
        }
        
        setMusicTracks(musicData.data || []);
        setVideoData(videoDataResult.data || []); // Use renamed variable
        setStoryVideos(storyData.data || []);
        setBlogPosts(blogData.data || []);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Set up a timer to update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  // Function to format countdown time
  const formatCountdown = (premiereDate) => {
    if (!premiereDate) return null;
    
    // If we're past the premiere time
    if (currentTime >= premiereDate) {
      return null; // We'll handle this separately in the UI
    }
    
    // Calculate time difference
    const diff = premiereDate - currentTime;
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Return structured countdown data
    return { hours, minutes, seconds };
  };
  
  // Check if premiere is live
  const isPremiereLive = (premiereDate) => {
    if (!premiereDate) return false;
    return currentTime >= premiereDate;
  };

  // Process music data for Hero component
  const latestTrack = useMemo(() => {
    return musicTracks && musicTracks.length > 0 ? {
      title: musicTracks[0].title,
      spotify_link: musicTracks[0].spotify_link,
      apple_music_link: musicTracks[0].apple_music_link,
      youtube_link: musicTracks[0].youtube_link,
      imageUrl: (musicTracks[0].image_url || '/images/album-cover.jpg').trim()
    } : null;
  }, [musicTracks]);

  // Process featured video
  const featuredVideo = videoData && videoData.length > 0 ? {
    id: 'featured',
    title: videoData[0].title || "Latest Music Video",
    description: videoData[0].description || "Check out the latest visual from the studio. This showcases the raw energy and street vibe that defines the sound.",
    videoId: videoData[0].video_id,
    platform: videoData[0].medium || 'youtube',
    thumbnailUrl: videoData[0].thumbnail_url || "/images/video-thumbnail.jpg",
    director: "Director Name",
    location: "Atlanta, GA" 
  } : null;

  // Transform database videos into storyItems format
  const generateStoryItems = () => {
    const fallbackItems = [
      {
        id: 'fallback1',
        type: 'image',
        src: '/images/story-1.jpg',
        alt: 'In the studio',
        title: 'Studio Session',
        description: 'Working on the next big hit',
        link: '/videos'
      },
      {
        id: 'fallback2',
        type: 'image',
        src: '/images/story-2.jpg',
        alt: 'Backstage moments',
        title: 'Behind The Scenes',
        description: 'Preparing for the Atlanta show',
        link: '/videos'
      }
    ];
    
    if (!storyVideos || storyVideos.length === 0) {
      return fallbackItems;
    }
    
    return storyVideos.map(video => {
      let platform = video.medium || 'youtube';
      if (video.video_id && video.video_id.includes('instagram.com')) {
        platform = 'instagram';
      }
      
      return {
        id: video.id.toString(),
        type: 'video',
        platform: platform,
        thumbnail: video.thumbnail_url || '/images/default-video-thumb.jpg',
        alt: video.title || 'Music video',
        title: video.title || 'Music Video',
        description: video.description || 'Check out this latest video',
        videoId: video.video_id,
        link: platform === 'instagram' 
          ? video.video_id 
          : `/videos?v=${video.video_id}`
      };
    });
  };

  const storyItems = generateStoryItems();

  const fallbackBlogPosts = [
    {
      id: 'b1',
      title: 'BNG NappSakk Announces New Single "BAPE"',
      slug: 'bng-nappsakk-announces-new-single-bape',
      excerpt: 'BNG NappSakk returns with "BAPE", a hard-hitting new single dropping this Friday that channels the Wilkinsburg energy while paying tribute to iconic streetwear culture.',
      featured_image: '/images/blog/bape-announcement.jpg',
      published_at: '2023-05-15T10:00:00.000Z',
      author_name: 'BNG Team'
    },
    {
      id: 'b2',
      title: 'Behind the Scenes: Meeting with Jadakiss',
      slug: 'behind-the-scenes-meeting-with-jadakiss',
      excerpt: 'BNG NappSakk connects with hip-hop legend Jadakiss in a pivotal career meeting, bridging generations and opening doors for potential collaborations.',
      featured_image: '/images/blog/jadakiss-meeting.jpg',
      published_at: '2023-06-20T14:30:00.000Z',
      author_name: 'Music Contributor'
    },
    {
      id: 'b3',
      title: 'Wilkinsburg Roots: How BNG Music Stays Connected to Community',
      slug: 'wilkinsburg-roots-community-connection',
      excerpt: 'Even as success grows, BNG NappSakk maintains deep ties to Wilkinsburg through youth workshops, community performances, and local investment in the next generation of artists.',
      featured_image: '/images/blog/wilkinsburg-community.jpg',
      published_at: '2023-07-10T09:15:00.000Z', 
      author_name: 'BNG Team'
    }
  ];

  const displayedPosts = (blogPosts && blogPosts.length > 0) ? blogPosts : fallbackBlogPosts;

  const structuredData = createMusicGroupSchema({
    description: artistInfo.shortBio || artistInfo.tagline,
    sameAs: [
      'https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe',
      'https://music.apple.com/us/artist/bng-nappsakk/1599225835',
      'https://www.youtube.com/@bngnappsakk',
    ],
  });

  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: 'rgba(255,255,255,0.3)',
        fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
        textTransform: 'uppercase', letterSpacing: '0.2em',
      }}>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading
        </motion.span>
      </div>
    );
  }

  return (
    <>
      <Script
        id="schema-musicgroup"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* === CINEMATIC HERO === */}
      <CinematicHero
        artistName={artistInfo.name}
        tagline={artistInfo.tagline}
        videoUrl="/videos/hero-background.mp4"
        fallbackImageUrl="/images/hero-bg.jpg"
        latestRelease={latestTrack}
      />

      {/* === CREDIBILITY BANNER === */}
      <CredibilityBanner />

      {/* === VIDEO PREMIERE + NEXT SHOW === */}
      {(premiereVideo || nextShow) && (
        <section className="promo-section section">
          <div className="container">
            <motion.div
              className="promo-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {premiereVideo && (
                <motion.div className="promo-card" variants={fadeInLeft}>
                  <div className="promo-video-wrap">
                    <VideoEmbed
                      videoId={premiereVideo.video_id}
                      platform={premiereVideo.medium || 'youtube'}
                      title={premiereVideo.title}
                    />
                  </div>
                  <div className="promo-info">
                    <span className="promo-badge">Video Premiere</span>
                    <h3 className="promo-title">{premiereVideo.title}</h3>
                    {isPremiereLive(premiereVideo.premiere_date ? new Date(premiereVideo.premiere_date) : null) ? (
                      <div className="live-badge">
                        <span className="pulse-dot" /> Streaming Now
                      </div>
                    ) : (
                      (() => {
                        const countdown = formatCountdown(premiereVideo.premiere_date ? new Date(premiereVideo.premiere_date) : null);
                        return countdown && (
                          <div className="countdown-row">
                            <div className="cd-unit"><span className="cd-val">{countdown.hours}</span><span className="cd-label">hrs</span></div>
                            <span className="cd-sep">:</span>
                            <div className="cd-unit"><span className="cd-val">{countdown.minutes.toString().padStart(2, '0')}</span><span className="cd-label">min</span></div>
                            <span className="cd-sep">:</span>
                            <div className="cd-unit"><span className="cd-val">{countdown.seconds.toString().padStart(2, '0')}</span><span className="cd-label">sec</span></div>
                          </div>
                        );
                      })()
                    )}
                    <a
                      href={`https://www.youtube.com/watch?v=${premiereVideo.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn promo-cta"
                    >
                      <FaPlay style={{ fontSize: '0.7rem' }} />
                      {isPremiereLive(premiereVideo.premiere_date ? new Date(premiereVideo.premiere_date) : null) ? 'Watch Now' : 'Watch Premiere'}
                    </a>
                  </div>
                </motion.div>
              )}

              {nextShow && (
                <motion.div className="promo-card show-card" variants={fadeInRight}>
                  <div className="show-image-wrap">
                    <Image
                      src={(nextShow.flyer_image || '/images/flyer-placeholder.jpg').trim()}
                      alt={`BNG NappSakk at ${nextShow.venue}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="show-image-overlay" />
                  </div>
                  <div className="show-info">
                    <span className="promo-badge live-badge-bg">Live Show</span>
                    <h3 className="promo-title">{nextShow.title}</h3>
                    <div className="show-details">
                      <p><FaMapMarkerAlt className="detail-icon" /> {nextShow.venue}</p>
                      <p><FaCalendarAlt className="detail-icon" /> {new Date(nextShow.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      {nextShow.time && <p><FaClock className="detail-icon" /> {nextShow.time}</p>}
                      <p className="show-city">{nextShow.city}, {nextShow.state}</p>
                    </div>
                    <Link href="/live" className="btn promo-cta">
                      Get Tickets <FaArrowRight style={{ fontSize: '0.75rem' }} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* === GOLD DIVIDER === */}
      <AnimateOnScroll variants={lineGrow} style={{ transformOrigin: 'center' }}>
        <hr className="gold-divider" />
      </AnimateOnScroll>

      {/* === VISUAL STORY / VIDEOS === */}
      {storyItems.length > 0 && (
        <section className="stories-section section">
          <div className="container">
            <AnimateOnScroll>
              <h2 className="section-heading">
                The <span className="text-gradient-gold">Story</span>
              </h2>
            </AnimateOnScroll>
            <motion.div
              className="stories-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {storyItems.slice(0, 6).map((item, i) => (
                <motion.div key={item.id} className="story-card" variants={fadeInUp}>
                  {item.type === 'video' ? (
                    <>
                      <div className="story-video-wrap">
                        <VideoEmbed
                          videoId={item.videoId}
                          platform={item.platform || 'youtube'}
                          title={item.title}
                        />
                      </div>
                      <div className="story-body">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <Link href={item.link} className="story-link">
                          Watch Full Video <FaArrowRight />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link href={item.link} className="story-image-link">
                      <div className="story-thumb">
                        <Image
                          src={item.src ? item.src.trim() : ''}
                          alt={item.alt}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 90vw, 380px"
                        />
                      </div>
                      <div className="story-body">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* === BIO SECTION === */}
      <section className="bio-section section">
        <div className="container">
          <AnimateOnScroll>
            <div className="bio-content">
              <h2>
                Who is <span className="text-gradient-gold">{artistInfo.name}</span>?
              </h2>
              <div className="bio-text">
                <p className="bio-paragraph" dangerouslySetInnerHTML={{ __html: artistInfo.longBio }} />
              </div>
              <div className="bio-ctas">
                <Link href="/about" className="btn">Read Full Bio</Link>
                <Link href="/contact" className="btn btn-outline">Booking Inquiries</Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === GOLD DIVIDER === */}
      <AnimateOnScroll variants={lineGrow} style={{ transformOrigin: 'center' }}>
        <hr className="gold-divider" />
      </AnimateOnScroll>

      {/* === LATEST NEWS === */}
      <section className="news-section section">
        <div className="container">
          <div className="section-header">
            <AnimateOnScroll>
              <h2 className="section-heading">
                Latest <span className="text-gradient-gold">News</span>
              </h2>
            </AnimateOnScroll>
            <Link href="/blog" className="view-all-link">
              View All <FaArrowRight />
            </Link>
          </div>

          <motion.div
            className="news-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {displayedPosts.map((post, i) => (
              <motion.article key={post.id} className="news-card" variants={fadeInUp}>
                <Link href={`/blog/${post.slug}`} className="news-card-inner">
                  <div className="news-image">
                    <Image
                      src={(post.featured_image || '/images/blog-placeholder.jpg').trim()}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="news-image-overlay" />
                  </div>
                  <div className="news-body">
                    <div className="news-meta">
                      <span className="news-date">{formatDate(post.published_at)}</span>
                      {post.author_name && <span className="news-author">{post.author_name}</span>}
                    </div>
                    <h3 className="news-title">{post.title}</h3>
                    <p className="news-excerpt">{post.excerpt}</p>
                    <span className="read-more">
                      Read More <FaArrowRight />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        /* === SECTION DEFAULTS === */
        .section-heading {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: gap 0.3s ease;
        }
        .view-all-link:hover { gap: 0.75rem; }

        /* === PROMO SECTION === */
        .promo-section {
          background: #0d0d0d;
        }

        .promo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 1.5rem;
        }

        .promo-card {
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: border-color 0.3s ease;
        }
        .promo-card:hover { border-color: rgba(240, 180, 41, 0.15); }

        .promo-video-wrap {
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .promo-info, .show-info {
          padding: 1.5rem;
        }

        .promo-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #ff3c00;
          background: rgba(255, 60, 0, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }
        .live-badge-bg { color: var(--color-primary); background: rgba(240, 180, 41, 0.1); }

        .promo-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #ff3c00;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
        }

        .pulse-dot {
          width: 8px; height: 8px;
          background: #ff3c00;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,60,0,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(255,60,0,0); }
        }

        .countdown-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .cd-unit { display: flex; flex-direction: column; align-items: center; }
        .cd-val {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          background: rgba(0,0,0,0.3);
          border-radius: 6px;
          padding: 0.2rem 0.5rem;
          min-width: 2.5rem;
          text-align: center;
        }
        .cd-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 0.15rem; }
        .cd-sep { font-size: 1.2rem; color: rgba(255,255,255,0.2); margin: 0 0.15rem; }

        .promo-cta {
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        /* Show card */
        .show-card { position: relative; }
        .show-image-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .show-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20,20,20,0.95) 0%, transparent 60%);
        }

        .show-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }
        .show-details p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          margin: 0;
        }
        .show-city {
          color: var(--color-primary) !important;
          font-weight: 600;
        }
        .show-details :global(.detail-icon) {
          font-size: 0.75rem;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        /* === STORIES SECTION === */
        .stories-section {
          background: #0a0a0a;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: 1.5rem;
        }

        .story-card {
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .story-card:hover {
          transform: translateY(-4px);
          border-color: rgba(240,180,41,0.12);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .story-video-wrap {
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .story-image-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .story-thumb {
          position: relative;
          width: 100%;
          padding-top: 65%;
        }

        .story-body {
          padding: 1.25rem;
        }
        .story-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.4rem;
        }
        .story-body p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .story-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.75rem;
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: gap 0.2s ease;
        }
        .story-link:hover { gap: 0.65rem; }

        /* === BIO SECTION === */
        .bio-section {
          background: linear-gradient(180deg, #0d0d0d 0%, #111 100%);
        }

        .bio-content {
          max-width: 780px;
          margin: 0 auto;
          text-align: center;
        }

        .bio-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.7);
          text-align: left;
          margin-bottom: 2rem;
        }

        .bio-paragraph:first-letter {
          font-size: 3.5rem;
          line-height: 1;
          font-weight: 900;
          float: left;
          margin-right: 0.5rem;
          color: var(--color-primary);
          font-family: var(--font-heading);
        }

        .bio-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* === NEWS SECTION === */
        .news-section {
          background: #0a0a0a;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: 1.5rem;
        }

        .news-card {
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .news-card:hover {
          transform: translateY(-4px);
          border-color: rgba(240,180,41,0.12);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .news-card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .news-image {
          position: relative;
          width: 100%;
          padding-top: 60%;
          overflow: hidden;
        }
        .news-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #141414 0%, transparent 50%);
        }
        .news-card:hover .news-image img {
          transform: scale(1.05);
        }
        .news-image :global(img) {
          transition: transform 0.5s ease;
        }

        .news-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .news-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .news-date { color: var(--color-primary); font-weight: 600; }
        .news-author { color: rgba(255,255,255,0.35); }

        .news-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-excerpt {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
          margin: 0 0 auto;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1rem;
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          transition: gap 0.2s ease;
        }
        .news-card:hover .read-more { gap: 0.65rem; }

        /* === RESPONSIVE === */
        @media (max-width: 1024px) {
          .promo-grid,
          .stories-grid,
          .news-grid {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media (max-width: 768px) {
          .promo-grid,
          .stories-grid,
          .news-grid {
            max-width: 480px;
          }

          .bio-ctas {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
