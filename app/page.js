"use client";

import ImmersiveHero from '../components/ImmersiveHero';
import VideoEmbed from '../components/VideoEmbed';
import Link from 'next/link';
import Image from 'next/image';
import { artistInfo } from '../data/mockData';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { createMusicGroupSchema } from '../lib/seo';
import { FaSpotify, FaApple, FaYoutube } from 'react-icons/fa';

// Since this is now a Client Component, we need to fetch data client-side
export default function Home() {
  const [musicTracks, setMusicTracks] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [storyVideos, setStoryVideos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch music data
        const musicResponse = await fetch('/api/music?featured=true&limit=1');
        const musicData = await musicResponse.json();
        
        // Fetch video data for the featured video section (3 videos)
        const videoResponse = await fetch('/api/videos?limit=3');
        const videoData = await videoResponse.json();
        
        // Fetch more videos for the story section (5 videos)
        const storyResponse = await fetch('/api/videos?limit=10');
        const storyData = await storyResponse.json();
        
        setMusicTracks(musicData.data || []);
        setVideoData(videoData.data || []);
        setStoryVideos(storyData.data || []);
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
    // Default fallback items in case database is empty
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
    
    // Map database videos to storyItems format
    return storyVideos.map(video => {
      // Detect Instagram URLs
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
          ? video.video_id // Use the full URL for Instagram
          : `/videos?v=${video.video_id}`
      };
    });
  };

  // Generate story items from database videos
  const storyItems = generateStoryItems();

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
      
      {/* Immersive Hero Section */}
      <ImmersiveHero 
        artistName={artistInfo.name}
        tagline={artistInfo.tagline}
        videoUrl="/videos/hero-background.mp4"
        fallbackImageUrl="/images/hero-bg.jpg"
        latestRelease={latestTrack}
      />
      
      {/* Visual Storytelling Section */}
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
      
      {/* Artist Bio Section */}
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
          color: #ff3c00;
        }
        
        /* Visual Story Section Styles */
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
          padding-top: 75%; /* 4:3 aspect ratio */
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
        
        /* Responsive styles for visual story section */
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
        
        /* Bio Section Styles */
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
          color: #ff3c00;
        }
        
        .bio-cta {
          margin-top: 2rem;
        }
        
        .btn-primary {
          background: #ff3c00;
          color: white;
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
          box-shadow: 0 8px 15px rgba(255, 60, 0, 0.3);
        }
        
        /* Featured Media Section Styles */
        .featured-media-section {
          padding: 5rem 0;
          background-color: rgba(0, 0, 0, 0.4);
        }
        
        .featured-video-container {
          margin-bottom: 2rem;
        }
        
        .video-wrapper {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          margin-bottom: 2rem;
          background-color: #000;
        }
        
        .embed-responsive {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
        }
        
        .instagram-embed {
          padding-top: 0;
          display: flex;
          justify-content: center;
          min-height: 500px;
          background-color: #f8f9fa;
        }
        
        .embed-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .video-details {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .video-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .video-description {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
        
        .video-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        @media (max-width: 768px) {
          .video-meta {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .instagram-embed {
            min-height: 400px;
          }
        }
      `}</style>
    </>
  );
}
