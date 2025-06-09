"use client";

import ImmersiveHero from '../components/ImmersiveHero';
import VideoEmbed from '../components/VideoEmbed';
import Link from 'next/link';
import Image from 'next/image';
import { artistInfo } from '../data/mockData';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { createMusicGroupSchema } from '../lib/seo';
import { FaSpotify, FaApple, FaYoutube, FaArrowRight } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

// Since this is now a Client Component, we need to fetch data client-side
export default function Home() {
  const [musicTracks, setMusicTracks] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [storyVideos, setStoryVideos] = useState(null);
  const [blogPosts, setBlogPosts] = useState(null);
  const [nextShow, setNextShow] = useState(null); // State for the next show
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
          console.warn("Blog API not available yet");
        }

        // Fetch next upcoming show
        const { data: liveEventsData, error: liveEventsError } = await supabase
          .from('live_events')
          .select('*')
          .order('date', { ascending: true })
          .limit(1);

        if (liveEventsError) {
          console.error('Error fetching next show:', liveEventsError);
        } else if (liveEventsData && liveEventsData.length > 0) {
          setNextShow(liveEventsData[0]);
        }
        
        setMusicTracks(musicData.data || []);
        setVideoData(videoDataResult.data || []); // Use renamed variable
        setStoryVideos(storyData.data || []);
        setBlogPosts(blogData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Process music data for Hero component
  const latestTrack = musicTracks && musicTracks.length > 0 ? {
    title: musicTracks[0].title,
    spotify_link: musicTracks[0].spotify_link,
    apple_music_link: musicTracks[0].apple_music_link,
    youtube_link: musicTracks[0].youtube_link,
    imageUrl: musicTracks[0].image_url || '/images/album-cover.jpg'
  } : null;

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
    return <div className="container text-center py-5">Loading...</div>;
  }

  return (
    <>
      <Script
        id="schema-musicgroup"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Next Show Promo Section - MOVED TO TOP */}
      {nextShow && (
        <section className="next-show-promo-section">
          <div className="container">
            <div className="promo-card">
              <div className="promo-image-wrapper">
                <Image
                  src={nextShow.flyer_image || '/images/flyer-placeholder.jpg'}
                  alt={`Flyer for ${nextShow.title} at ${nextShow.venue}`}
                  width={300}
                  height={400}
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <div className="promo-details">
                <h4>Live Event!</h4>
                <h3>{nextShow.title}</h3>
                <p className="venue">{nextShow.venue}</p>
                <p className="date-time">
                  {new Date(nextShow.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - {nextShow.time}
                </p>
                <p className="location">{nextShow.city}, {nextShow.state}</p>
                <Link href="/live" className="promo-cta-btn">
                  View Details <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <ImmersiveHero 
        artistName={artistInfo.name}
        tagline={artistInfo.tagline}
        videoUrl="/videos/hero-background.mp4"
        fallbackImageUrl="/images/hero-bg.jpg"
        latestRelease={latestTrack}
      />
      
      <section className="visual-story-section">
        <div className="container">
          <h2 className="section-title">The <span className="highlight">Story</span></h2>
          <div className="visual-story-container">
            {storyItems.map((item) => (
              <div key={item.id} className="story-item-wrapper">
                {item.type === 'video' ? (
                  <div className="story-item video-item">
                    <div className="story-video-container">
                      <VideoEmbed 
                        videoId={item.videoId} 
                        platform={item.platform || 'youtube'}
                        title={item.title}
                      />
                    </div>
                    <div className="story-caption">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <Link href={item.link} className="view-more-link">
                        Watch Full Video
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link href={item.link} className="story-item">
                    <div className="story-media">
                      <div className="thumbnail-container">
                        <Image 
                          src={item.src}
                          alt={item.alt}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 380px"
                        />
                      </div>
                    </div>
                    
                    <div className="story-caption">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bio-section">
        <div className="container">
          <div className="fade-in bio-content">
            <h2>Who is <span className="highlight">{artistInfo.name}</span>?</h2>
            <div className="bio-text">
              <p 
                className="bio-paragraph" 
                dangerouslySetInnerHTML={{ __html: artistInfo.longBio }} 
              />
            </div>
            
            <div className="bio-cta">
              <Link href="/contact" className="btn btn-primary">
                Booking & Inquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="latest-news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest <span className="highlight">News</span></h2>
            <Link href="/blog" className="view-all-link">
              View All Posts <FaArrowRight className="arrow-icon" />
            </Link>
          </div>
          
          <div className="blog-posts-grid">
            {displayedPosts.map(post => (
              <article key={post.id} className="blog-card fade-in">
                <Link href={`/blog/${post.slug}`} className="blog-card-inner">
                  <div className="blog-image-container">
                    <Image
                      src={post.featured_image || '/images/blog-placeholder.jpg'}
                      alt={post.title}
                      width={600}
                      height={340}
                      className="blog-image"
                    />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">{formatDate(post.published_at)}</span>
                      {post.author_name && (
                        <span className="blog-author">By {post.author_name}</span>
                      )}
                    </div>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <span className="read-more-link">
                      Read More <FaArrowRight className="read-more-icon" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .highlight {
          color: var(--color-primary); /* Using CSS variable for highlight */
        }

        /* Next Show Promo Section Styles */
        .next-show-promo-section {
          padding: 3rem 0;
          background-color: #181818; /* Dark background for the section */
        }
        .promo-card {
          display: flex;
          background-color: var(--color-card-bg); /* Using card background color from variables */
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.5);
          overflow: hidden;
          max-width: 800px; /* Adjusted max-width */
          margin: 0 auto;
          border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
        }
        .promo-image-wrapper {
          flex: 0 0 40%;
          min-width: 250px; /* Minimum width for image on larger screens */
        }
        .promo-image-wrapper img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .promo-details {
          padding: 1.5rem 2rem;
          flex-grow: 1;
          color: var(--color-text);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .promo-details h4 {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }
        .promo-details h3 {
          font-size: 1.8rem;
          margin-bottom: 0.75rem;
          color: var(--color-text); 
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .promo-details p {
          margin-bottom: 0.5rem;
          font-size: 1rem;
          color: #ccc;
        }
        .promo-details .venue {
          font-weight: 600;
          color: var(--color-text);
        }
        .promo-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.6rem 1.2rem;
          background-color: var(--color-primary);
          color: var(--color-background); /* Text color for button */
          border-radius: 5px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.3s ease, transform 0.2s ease;
          border: 1px solid transparent;
        }
        .promo-cta-btn:hover {
          background-color: color-mix(in srgb, var(--color-primary) 85%, black);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .promo-card {
            flex-direction: column;
          }
          .promo-image-wrapper {
            width: 100%;
            max-height: 350px; /* Adjusted max height for mobile flyer */
          }
          .promo-details {
            padding: 1.5rem;
            text-align: center;
          }
          .promo-details h3 {
            font-size: 1.5rem;
          }
        }
        /* End Next Show Promo Section Styles */
        
        .visual-story-section {
          padding: 4rem 0;
          background-color: rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .visual-story-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .story-item-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .story-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #111;
        }
        
        .story-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .story-video-container {
          width: 100%;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
        
        .story-video-container :global(.video-embed) {
          margin-bottom: 0 !important;
        }
        
        .story-media {
          position: relative;
          width: 100%;
          padding-top: 75%;
        }
        
        .thumbnail-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .story-caption {
          padding: 1rem;
          background: #181818;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .story-caption h3 {
          margin: 0 0 0.5rem;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .story-caption p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.4;
        }
        
        .view-more-link {
          display: inline-block;
          margin-top: 1rem;
          color: #ff3c00;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        
        .view-more-link:hover {
          color: #ff6833;
          text-decoration: underline;
        }
        
        @media (max-width: 992px) {
          .visual-story-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .visual-story-container {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }
        }
        
        .bio-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
        }
        
        .bio-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .bio-content h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }
        
        .bio-text {
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          text-align: left;
        }
        
        .bio-paragraph:first-letter {
          font-size: 3.5rem;
          line-height: 1;
          font-weight: bold;
          float: left;
          margin-right: 0.5rem;
          color: var(--color-primary); /* Using CSS variable */
        }
        
        .bio-cta {
          margin-top: 2rem;
        }
        
        .btn-primary {
          background: var(--color-primary); /* Using CSS variable */
          color: var(--color-background); /* Ensure contrast */
          border: none;
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px color-mix(in srgb, var(--color-primary) 30%, transparent); /* Shadow with primary color */
          background-color: color-mix(in srgb, var(--color-primary) 85%, black); /* Darker shade on hover */
        }
        
        .latest-news-section {
          padding: 5rem 0;
          background-color: rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .section-header .section-title {
          margin-bottom: 0;
        }
        
        .view-all-link {
          display: flex;
          align-items: center;
          color: var(--color-primary); /* Using CSS variable */
          font-weight: 600;
          text-decoration: none;
          font-size: 1.1rem;
          transition: opacity 0.2s ease;
          gap: 0.5rem;
        }
        
        .view-all-link:hover {
          opacity: 0.8;
        }
        
        .arrow-icon {
          font-size: 0.9rem;
          transition: transform 0.2s ease;
        }
        
        .view-all-link:hover .arrow-icon {
          transform: translateX(4px);
        }
        
        .blog-posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        .blog-card {
          background-color: rgba(26, 26, 26, 0.9);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .blog-card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: inherit;
          text-decoration: none;
        }
        
        .blog-image-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          overflow: hidden;
        }
        
        .blog-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.05);
        }
        
        .blog-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .blog-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 0.75rem;
        }
        
        .blog-date {
          color: var(--color-primary); /* Using CSS variable */
        }
        
        .blog-title {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
          line-height: 1.3;
          font-weight: 700;
        }
        
        .blog-excerpt {
          margin: 0 0 auto;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #ccc;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        
        .read-more-link {
          display: flex;
          align-items: center;
          margin-top: 1.5rem;
          color: var(--color-primary); /* Using CSS variable */
          font-weight: 600;
          font-size: 0.9rem;
          gap: 0.5rem;
        }
        
        .read-more-icon {
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }
        
        .blog-card:hover .read-more-icon {
          transform: translateX(4px);
        }
        
        @media (max-width: 992px) {
          .blog-posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .blog-posts-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }
          
          .blog-card {
            margin-bottom: 1.5rem;
          }
          
          .blog-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
