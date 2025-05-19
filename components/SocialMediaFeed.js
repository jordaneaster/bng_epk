"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaInstagram, 
  FaTwitter, 
  FaTiktok, 
  FaExternalLinkAlt,
  FaRegComment,
  FaRegHeart,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay
} from 'react-icons/fa';

const SocialMediaFeed = ({ socialData }) => {
  const [activeTab, setActiveTab] = useState('instagram');
  const [isVisible, setIsVisible] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [storyPaused, setStoryPaused] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const sectionRef = useRef(null);
  const storyTimerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle story navigation and timing
  useEffect(() => {
    if (activeStory && !storyPaused) {
      // Clear any existing timer
      if (storyTimerRef.current) {
        clearTimeout(storyTimerRef.current);
      }
      
      // Set timer for auto-advancing stories
      storyTimerRef.current = setTimeout(() => {
        const storyData = data.stories.find(s => s.username === activeStory);
        if (storyData && currentStoryIndex < storyData.items.length - 1) {
          // Go to next item in current story
          setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
          // Find next story or close if at the end
          const currentStoryIdx = data.stories.findIndex(s => s.username === activeStory);
          if (currentStoryIdx < data.stories.length - 1) {
            // Go to next person's story
            setActiveStory(data.stories[currentStoryIdx + 1].username);
            setCurrentStoryIndex(0);
          } else {
            // End of all stories
            closeStory();
          }
        }
      }, 5000); // Story duration: 5 seconds
    }
    
    return () => {
      if (storyTimerRef.current) {
        clearTimeout(storyTimerRef.current);
      }
    };
  }, [activeStory, currentStoryIndex, storyPaused]);

  // Close story viewer
  const closeStory = () => {
    setActiveStory(null);
    setCurrentStoryIndex(0);
    setStoryPaused(false);
  };

  // Handle story navigation
  const navigateStory = (direction) => {
    const storyData = data.stories.find(s => s.username === activeStory);
    
    if (direction === 'next') {
      if (currentStoryIndex < storyData.items.length - 1) {
        // Next item in current story
        setCurrentStoryIndex(currentStoryIndex + 1);
      } else {
        // Go to next person's story
        const currentStoryIdx = data.stories.findIndex(s => s.username === activeStory);
        if (currentStoryIdx < data.stories.length - 1) {
          setActiveStory(data.stories[currentStoryIdx + 1].username);
          setCurrentStoryIndex(0);
        } else {
          // End of all stories
          closeStory();
        }
      }
    } else {
      // Previous
      if (currentStoryIndex > 0) {
        // Previous item in current story
        setCurrentStoryIndex(currentStoryIndex - 1);
      } else {
        // Go to previous person's story
        const currentStoryIdx = data.stories.findIndex(s => s.username === activeStory);
        if (currentStoryIdx > 0) {
          setActiveStory(data.stories[currentStoryIdx - 1].username);
          // Set to last item of previous story
          const prevStoryItemCount = data.stories[currentStoryIdx - 1].items.length;
          setCurrentStoryIndex(prevStoryItemCount - 1);
        } else {
          // At the beginning, do nothing or close
          closeStory();
        }
      }
    }
  };

  // Toggle story playback
  const togglePause = () => {
    setStoryPaused(!storyPaused);
  };

  // Default social media data if none provided
  const defaultSocialData = {
    // Add stories data
    stories: [
      {
        username: 'bng_nappsakk',
        profileImage: '/images/artist-profile.jpg',
        items: [
          {
            id: 'story1',
            type: 'image',
            url: '/images/story-1.jpg',
            caption: 'In the studio working on something 🔥 #NewHeat'
          },
          {
            id: 'story2',
            type: 'video',
            url: '/videos/story-clip.mp4',
            poster: '/images/story-2.jpg',
            caption: 'Preview of the new track dropping Friday'
          }
        ]
      },
      {
        username: 'studio_session',
        profileImage: '/images/studio-profile.jpg',
        items: [
          {
            id: 'story3',
            type: 'image',
            url: '/images/story-3.jpg',
            caption: 'BTS with the crew'
          },
          {
            id: 'story4',
            type: 'image',
            url: '/images/story-4.jpg',
            caption: 'New beats coming soon 🎧'
          }
        ]
      },
      {
        username: 'tour_life',
        profileImage: '/images/tour-profile.jpg',
        items: [
          {
            id: 'story5',
            type: 'image',
            url: '/images/story-5.jpg',
            caption: 'On the road again #TourLife'
          }
        ]
      }
    ],
    instagram: [
      {
        id: 'insta1',
        imageUrl: '/images/insta-1.jpg',
        caption: 'In the studio working on something special #NewMusic',
        likes: 1425,
        comments: 87,
        date: '2 days ago',
        link: 'https://instagram.com/bng_nappsakk/'
      },
      {
        id: 'insta2',
        imageUrl: '/images/insta-2.jpg',
        caption: 'Behind the scenes from the latest video shoot 🎬 #ComingSoon',
        likes: 2104,
        comments: 145,
        date: '5 days ago',
        link: 'https://instagram.com/bng_nappsakk/'
      },
      {
        id: 'insta3',
        imageUrl: '/images/insta-3.jpg',
        caption: 'Fan love is the best love 🙏 #Grateful #OnTheRoad',
        likes: 3211,
        comments: 201,
        date: '1 week ago',
        link: 'https://instagram.com/bng_nappsakk/'
      },
      {
        id: 'insta4',
        imageUrl: '/images/insta-4.jpg',
        caption: 'New merch dropping soon. Who\'s getting it? 👕',
        likes: 1877,
        comments: 132,
        date: '1 week ago',
        link: 'https://instagram.com/bng_nappsakk/'
      }
    ],
    twitter: [
      {
        id: 'tweet1',
        text: 'New single dropping this Friday. You ain\'t ready for this one! #NewMusic',
        likes: 876,
        retweets: 312,
        date: '1 day ago',
        link: 'https://x.com/BNG_Nappsakk'
      },
      {
        id: 'tweet2',
        text: 'S/O to everyone who came out to the show last night. Energy was crazy! 🔥',
        likes: 1224,
        retweets: 146,
        date: '3 days ago',
        link: 'https://x.com/BNG_Nappsakk'
      },
      {
        id: 'tweet3',
        text: 'Working with @ProducerName on this next project. We cooking up something special!',
        likes: 941,
        retweets: 87,
        date: '5 days ago',
        link: 'https://x.com/BNG_Nappsakk'
      }
    ],
    tiktok: [
      {
        id: 'tiktok1',
        thumbnailUrl: '/images/tiktok-1.jpg',
        caption: 'When the beat drops... #fyp #music',
        likes: 24500,
        comments: 1200,
        date: '3 days ago',
        link: 'https://www.tiktok.com/@bng_nappsakk'
      },
      {
        id: 'tiktok2',
        thumbnailUrl: '/images/tiktok-2.jpg',
        caption: 'BTS from the studio session #newmusic',
        likes: 18700,
        comments: 890,
        date: '1 week ago',
        link: 'https://www.tiktok.com/@bng_nappsakk'
      }
    ]
  };

  // Use provided data or default
  const data = socialData || defaultSocialData;

  // Stories Component
  const InstagramStories = () => {
    return (
      <div className="instagram-stories">
        <h3 className="stories-title">Latest Stories</h3>
        <div className="stories-container">
          {data.stories.map((story) => (
            <div 
              key={story.username} 
              className="story-circle"
              onClick={() => {
                setActiveStory(story.username);
                setCurrentStoryIndex(0);
              }}
            >
              <div className="story-avatar">
                <Image
                  src={story.profileImage}
                  alt={story.username}
                  width={60}
                  height={60}
                  className="avatar-image"
                />
              </div>
              <p className="story-username">{story.username}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Story Viewer Component
  const StoryViewer = () => {
    if (!activeStory) return null;
    
    const storyData = data.stories.find(s => s.username === activeStory);
    if (!storyData) return null;
    
    const currentItem = storyData.items[currentStoryIndex];
    const totalItems = storyData.items.length;
    
    return (
      <div className="story-viewer">
        <div className="story-header">
          <div className="story-progress">
            {storyData.items.map((_, i) => (
              <div 
                key={i} 
                className={`progress-bar ${i === currentStoryIndex ? 'active' : ''} ${i < currentStoryIndex ? 'completed' : ''}`}
              />
            ))}
          </div>
          
          <div className="story-user-info">
            <div className="story-avatar-small">
              <Image
                src={storyData.profileImage}
                alt={storyData.username}
                width={30}
                height={30}
              />
            </div>
            <span className="story-username">{storyData.username}</span>
          </div>
          
          <button className="story-close" onClick={closeStory}>
            <FaTimes />
          </button>
        </div>
        
        <div className="story-content">
          {currentItem.type === 'video' ? (
            <video 
              src={currentItem.url}
              poster={currentItem.poster}
              autoPlay={!storyPaused}
              loop
              playsInline
              muted
              className="story-media"
            />
          ) : (
            <div className="story-image-container">
              <Image
                src={currentItem.url}
                alt={currentItem.caption || 'Story image'}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          )}
          
          {currentItem.caption && (
            <div className="story-caption">
              {currentItem.caption}
            </div>
          )}
        </div>
        
        <div className="story-navigation">
          <button 
            className="nav-button prev"
            onClick={() => navigateStory('prev')}
          >
            <FaChevronLeft />
          </button>
          
          <button 
            className="nav-button toggle-play"
            onClick={togglePause}
          >
            {storyPaused ? <FaPlay /> : <FaPause />}
          </button>
          
          <button 
            className="nav-button next"
            onClick={() => navigateStory('next')}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'instagram':
        return (
          <div className="instagram-feed">
            {data.instagram.map(post => (
              <Link 
                href={post.link}
                key={post.id}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-post"
              >
                <div className="post-image">
                  <Image 
                    src={post.imageUrl}
                    alt="Instagram post"
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="post-info">
                  <p className="post-caption">{post.caption}</p>
                  <div className="post-stats">
                    <span><FaRegHeart /> {post.likes}</span>
                    <span><FaRegComment /> {post.comments}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
      
      case 'twitter':
        return (
          <div className="twitter-feed">
            {data.twitter.map(tweet => (
              <Link 
                href={tweet.link}
                key={tweet.id}
                target="_blank"
                rel="noopener noreferrer"
                className="tweet"
              >
                <div className="tweet-content">
                  <p>{tweet.text}</p>
                  <div className="tweet-stats">
                    <span>♥ {tweet.likes}</span>
                    <span>↻ {tweet.retweets}</span>
                    <span className="tweet-date">{tweet.date}</span>
                  </div>
                </div>
                <FaExternalLinkAlt className="external-link-icon" />
              </Link>
            ))}
          </div>
        );
      
      case 'tiktok':
        return (
          <div className="tiktok-feed">
            {data.tiktok.map(video => (
              <Link 
                href={video.link}
                key={video.id}
                target="_blank"
                rel="noopener noreferrer"
                className="tiktok-video"
              >
                <div className="video-thumbnail">
                  <Image 
                    src={video.thumbnailUrl}
                    alt="TikTok video"
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="tiktok-overlay">
                    <FaTiktok className="tiktok-icon" />
                  </div>
                </div>
                <div className="video-info">
                  <p className="video-caption">{video.caption}</p>
                  <div className="video-stats">
                    <span>♥ {video.likes}</span>
                    <span>💬 {video.comments}</span>
                    <span className="video-date">{video.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
      
      default:
        return <div>Select a platform to see content</div>;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`social-media-feed ${isVisible ? 'visible' : ''}`}
    >
      {activeStory && <StoryViewer />}
      
      <div className="container">
        <h2 className="section-title">
          Social <span className="highlight">Feed</span>
        </h2>
        
        {/* Add Instagram Stories at the top */}
        <InstagramStories />
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'instagram' ? 'active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            <FaInstagram /> Instagram
          </button>
          
          <button 
            className={`tab ${activeTab === 'twitter' ? 'active' : ''}`}
            onClick={() => setActiveTab('twitter')}
          >
            <FaTwitter /> Twitter
          </button>
          
          <button 
            className={`tab ${activeTab === 'tiktok' ? 'active' : ''}`}
            onClick={() => setActiveTab('tiktok')}
          >
            <FaTiktok /> TikTok
          </button>
        </div>
        
        <div className="social-content">
          {renderContent()}
        </div>
        
        <div className="follow-cta">
          <p>Stay connected for the latest updates</p>
          <div className="social-buttons">
            <Link 
              href="https://instagram.com/bng_nappsakk/" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-button instagram"
            >
              <FaInstagram /> Follow on Instagram
            </Link>
            
            <Link 
              href="https://x.com/BNG_Nappsakk" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-button twitter"
            >
              <FaTwitter /> Follow on Twitter
            </Link>
            
            <Link 
              href="https://www.tiktok.com/@bng_nappsakk" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-button tiktok"
            >
              <FaTiktok /> Follow on TikTok
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-media-feed {
          padding: 5rem 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .social-media-feed.visible {
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
          text-align: center;
        }
        
        /* Instagram Stories Styles */
        .instagram-stories {
          margin-bottom: 2.5rem;
        }
        
        .stories-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          text-align: left;
        }
        
        .stories-container {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding: 0.5rem 0;
          -ms-overflow-style: none;  /* Hide scrollbar IE and Edge */
          scrollbar-width: none;  /* Hide scrollbar Firefox */
        }
        
        .stories-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar Chrome, Safari, Opera */
        }
        
        .story-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          min-width: 70px;
        }
        
        .story-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          margin-bottom: 0.5rem;
        }
        
        .avatar-image {
          border-radius: 50%;
          border: 2px solid #000;
        }
        
        .story-username {
          font-size: 0.8rem;
          margin: 0;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70px;
        }
        
        /* Story Viewer Styles */
        .story-viewer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        
        .story-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1001;
        }
        
        .story-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 4px;
          padding: 1rem 1rem 0;
        }
        
        .progress-bar {
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          flex: 1;
          border-radius: 2px;
        }
        
        .progress-bar.active {
          background: white;
          animation: progress 5s linear forwards;
        }
        
        .progress-bar.completed {
          background: white;
        }
        
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        .story-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .story-avatar-small {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .story-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .story-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .story-media {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .story-image-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .story-caption {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 1rem;
          text-align: center;
        }
        
        .story-navigation {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
          z-index: 1001;
        }
        
        .nav-button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .nav-button.prev {
          margin-right: auto;
        }
        
        .nav-button.next {
          margin-left: auto;
        }
        
        .nav-button.toggle-play {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .highlight {
          color: #ff3c00;
        }
        
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tab {
          background: none;
          border: none;
          color: white;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
          position: relative;
        }
        
        .tab:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff3c00;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .tab.active {
          color: #ff3c00;
        }
        
        .tab.active:after {
          transform: scaleX(1);
        }
        
        .social-content {
          min-height: 400px;
        }
        
        /* Instagram Feed Styles */
        .instagram-feed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .instagram-post {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .instagram-post:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .post-image {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 aspect ratio */
        }
        
        .post-info {
          padding: 1rem;
        }
        
        .post-caption {
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .post-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .post-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .post-date {
          margin-left: auto;
        }
        
        /* Twitter Feed Styles */
        .twitter-feed {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .tweet {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          color: white;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
        }
        
        .tweet:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.3);
        }
        
        .tweet-content {
          flex: 1;
        }
        
        .tweet-content p {
          margin: 0 0 1rem;
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .tweet-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .tweet-date {
          margin-left: auto;
        }
        
        .external-link-icon {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
          margin-left: 1rem;
          flex-shrink: 0;
        }
        
        /* TikTok Feed Styles */
        .tiktok-feed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .tiktok-video {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .tiktok-video:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .video-thumbnail {
          position: relative;
          width: 100%;
          padding-top: 177.8%; /* TikTok's 9:16 aspect ratio */
        }
        
        .tiktok-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tiktok-icon {
          color: white;
          font-size: 16px;
        }
        
        .video-info {
          padding: 1rem;
        }
        
        .video-caption {
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .video-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .follow-cta {
          margin-top: 3rem;
          text-align: center;
        }
        
        .follow-cta p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
        
        .social-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .social-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 30px;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .social-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
        }
        
        .instagram {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }
        
        .twitter {
          background: #1DA1F2;
        }
        
        .tiktok {
          background: linear-gradient(45deg, #000000, #25F4EE, #FE2C55, #000000);
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .tabs {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .tab {
            padding: 0.75rem 1rem;
            flex: 1;
            justify-content: center;
          }
          
          .social-buttons {
            flex-direction: column;
          }
          
          .twitter-feed {
            padding: 0 1rem;
          }
          
          .story-navigation {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default SocialMediaFeed;
