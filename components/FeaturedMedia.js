"use client";

import { useState } from 'react';
import Link from 'next/link';
import VideoEmbed from './VideoEmbed';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

const FeaturedMedia = ({ 
  featuredVideo, 
  relatedVideos = [],
  useThumbnailFrame = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!featuredVideo) {
    return null;
  }

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="featured-media-section">
      <div className="container">
        <h2 className="section-title">Featured <span className="highlight">Video</span></h2>
        
        <div className="featured-video">
          {isPlaying || !useThumbnailFrame ? (
            <VideoEmbed 
              videoId={featuredVideo.videoId} 
              platform={featuredVideo.platform || 'youtube'}
              title={featuredVideo.title}
            />
          ) : (
            <div className="video-thumbnail-container" onClick={handlePlayClick}>
              {/* Use VideoEmbed with thumbnail mode to get first frame */}
              <div className="thumbnail-preview">
                <VideoEmbed 
                  videoId={featuredVideo.videoId}
                  platform={featuredVideo.platform || 'youtube'}
                  thumbnailOnly={true} 
                  title={featuredVideo.title}
                />
              </div>
              
              <div className="play-overlay">
                <div className="play-button">
                  <FaPlay />
                </div>
                <div className="play-text">Play Video</div>
              </div>
            </div>
          )}
          
          <div className="video-details">
            <h3 className="video-title">{featuredVideo.title}</h3>
            <p className="video-description">{featuredVideo.description}</p>
            
            {featuredVideo.director && featuredVideo.location && (
              <div className="video-meta">
                <span className="director">Director: {featuredVideo.director}</span>
                <span className="location">Location: {featuredVideo.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {relatedVideos && relatedVideos.length > 0 && (
          <div className="related-videos">
            <h3 className="related-title">More Videos</h3>
            
            <div className="related-grid">
              {relatedVideos.map((video) => (
                <Link 
                  href={`/videos?v=${video.videoId}`} 
                  key={video.id}
                  className="related-video-card"
                >
                  <div className="related-thumbnail">
                    {useThumbnailFrame ? (
                      <VideoEmbed 
                        videoId={video.videoId}
                        platform={video.platform || 'youtube'}
                        thumbnailOnly={true}
                        title={video.title}
                      />
                    ) : (
                      <Image 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        priority={false}
                      />
                    )}
                    <div className="play-icon">
                      <FaPlay />
                    </div>
                  </div>
                  <h4 className="related-video-title">{video.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .featured-media-section {
          padding: 4rem 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .featured-media-section.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .highlight {
          color: #ff3c00;
        }
        
        .featured-video {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .video-thumbnail-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .thumbnail-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .thumbnail-preview :global(.video-embed) {
          margin-bottom: 0 !important;
        }
        
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        
        .video-thumbnail-container:hover .play-overlay {
          background: rgba(0, 0, 0, 0.5);
        }
        
        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255, 60, 0, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        
        .video-thumbnail-container:hover .play-button {
          transform: scale(1.1);
          background: rgb(255, 60, 0);
        }
        
        .play-text {
          margin-top: 1rem;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .video-details {
          padding: 1.5rem;
          color: white;
        }
        
        .video-title {
          font-size: 1.8rem;
          margin: 0 0 1rem;
          font-weight: 600;
        }
        
        .video-description {
          margin: 0 0 1.5rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .video-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .director, .location {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .related-videos {
          margin-top: 2rem;
        }
        
        .related-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .related-video-card {
          text-decoration: none;
          color: white;
          transition: transform 0.3s ease;
        }
        
        .related-video-card:hover {
          transform: translateY(-5px);
        }
        
        .related-thumbnail {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: rgba(255, 60, 0, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .related-video-card:hover .play-icon {
          opacity: 1;
        }
        
        .related-video-title {
          font-size: 1rem;
          margin: 0.5rem 0 0;
          font-weight: 500;
        }
        
        @media (min-width: 768px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
            text-align: center;
          }
          
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr;
          }
          
          .play-button {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedMedia;
