"use client";
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

export default function MusicPlayerEmbed({ type, embedId, title, isMobile = false }) {
  // Fully transparent wrapper style
  const transparentWrapperStyle = {
    background: 'transparent',
    borderRadius: '10px',
    overflow: 'hidden',
    backdropFilter: 'none'
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);
  
  // Simple custom player using audio element
  const CustomPlayer = ({ url, title }) => {
    return (
      <div className="custom-music-player" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-4.5l6-4.5-6-4.5v9z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Now Available</div>
            </div>
          </div>
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '16px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fc3c44">
              <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428c-1.03.41-1.83 1.05-2.43 2-.75 1.17-.988 2.44-.978 3.78.01 1.272.03 2.55.088 3.82.065 1.35.148 2.7.233 4.05.058.943.14 1.886.224 2.83.05.572.124 1.14.205 1.704.096.673.206 1.342.39 2 .42 1.52 1.375 2.57 2.94 3.08.544.176 1.1.257 1.67.28l1.02.032c2.73.046 5.46.044 8.18.004.58-.008 1.16-.034 1.73-.1 1.065-.124 2.012-.5 2.807-1.23.897-.823 1.378-1.88 1.513-3.092.032-.28.05-.562.055-.847.04-2.52.067-5.04.067-7.56 0-1.53-.012-3.06-.04-4.59-.002-.072-.006-.146-.01-.22zm-7.073 9.477c-.512.75-1.21 1.096-2.09 1.065-.887-.032-1.54-.486-1.97-1.27-.82-1.504-.82-3.022.032-4.516.47-.83 1.172-1.32 2.12-1.342.95-.022 1.673.4 2.198 1.188.61.905.78 1.934.607 3.008-.15.938-.556 1.677-1.142 2.334-.02.022-.057.033-.077.045.023-.01.05-.02.077-.045.038-.037.073-.018.043-.045.497-.573.866-1.214 1.06-1.994.17-.68.2-1.37.06-2.066zM17.6 9.64c-.988-.864-2.46-.888-3.492-.135-.084-.45-.22-.888-.4-1.304-.48-1.105-1.19-1.968-2.2-2.594-.83-.518-1.705-.736-2.65-.608-2.003.27-3.604 2.13-3.74 4.098-.165 2.38 1.307 4.596 3.57 5.357 1.35.455 2.6.025 3.77-.97.07-.063.142-.123.218-.19.578 1.45 1.552 2.438 3.09 2.76 1.48.306 3.1-.418 3.96-1.753.958-1.498.98-3.344.128-4.915.02.022.014.045-.033.104-.226.273-.48.515-.75.738z"/>
            </svg>
            Listen
          </a>
        </div>
      </div>
    );
  };

  // MusicKit player (Apple Music) - requires MusicKit JS setup
  const AppleMusicKitPlayer = () => {
    // This requires MusicKit JS to be initialized in your _app.js or layout
    return (
      <div>
        <div id="apple-music-player"></div>
        <Script
          id="apple-music-kit"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('musickitloaded', function() {
                // Configure MusicKit
                MusicKit.configure({
                  developerToken: 'YOUR_DEVELOPER_TOKEN', // You need to get this from Apple
                  app: {
                    name: 'Your App Name',
                    build: '1.0.0'
                  }
                });
                
                // Get instance
                const music = MusicKit.getInstance();
                
                // Set up player for song
                music.setQueue({
                  song: '${embedId}'
                });
              });
            `
          }}
        />
      </div>
    );
  };

  const renderEmbed = () => {
    switch (type) {
      case 'spotify':
        return (
          <div style={{ background: 'transparent' }}>
            <iframe 
              src={`https://open.spotify.com/embed/track/${embedId}?theme=0&background=transparent`} 
              width="100%" 
              height="80" 
              frameBorder="0" 
              allowtransparency="true" 
              allow="encrypted-media"
              title={`Spotify: ${title}`}
              style={{ 
                background: 'transparent',
                border: 'none'
              }}
            ></iframe>
          </div>
        );

      case 'apple':
        return (
          <div style={{ background: 'transparent' }}>
            <iframe 
              allow="autoplay *; encrypted-media *; fullscreen *" 
              height={isMobile ? "150" : "175"} 
              style={{ 
                width: '100%', 
                maxWidth: isMobile ? '660px' : '760px',
                overflow: 'hidden', 
                background: 'transparent',
                border: 'none',
                backdropFilter: 'none'
              }} 
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
              src={`https://embed.music.apple.com/us/album/${embedId}?app=music&theme=dark&background=transparent`}
              title={`Apple Music: ${title}`}
              allowtransparency="true"
            ></iframe>
          </div>
        );
      
      case 'simpleApple':
        const albumId = embedId.split('?')[0];
        const appleUrl = `https://music.apple.com/album/${albumId}`;
        return <CustomPlayer url={appleUrl} title={title} />;
      
      case 'appleKit':
        return <AppleMusicKitPlayer />;

      case 'soundcloud':
        return (
          <div style={{ background: 'transparent' }}>
            <iframe 
              width="100%" 
              height="166" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${embedId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&theme=dark`}
              title={`SoundCloud: ${title}`}
              style={{ 
                background: 'transparent',
                border: 'none'
              }}
              allowtransparency="true"
            ></iframe>
          </div>
        );
        
      default:
        return <p>Unsupported music player</p>;
    }
  };

  return (
    <div 
      className="music-player-embed mb-3" 
      style={transparentWrapperStyle}
    >
      {renderEmbed()}
    </div>
  );
}
