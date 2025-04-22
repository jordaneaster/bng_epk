export default function MusicPlayerEmbed({ type, embedId, title }) {
  const renderEmbed = () => {
    switch (type) {
      case 'spotify':
        return (
          <iframe 
            src={`https://open.spotify.com/embed/track/${embedId}`} 
            width="100%" 
            height="80" 
            frameBorder="0" 
            allowtransparency="true" 
            allow="encrypted-media"
            title={`Spotify: ${title}`}
          ></iframe>
        );
      case 'apple':
        return (
          <iframe 
            allow="autoplay *; encrypted-media *; fullscreen *" 
            height="175" // Reduced from 350
            style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }} 
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
            src={`https://embed.music.apple.com/us/album/${embedId}`}
            title={`Apple Music: ${title}`}
          ></iframe>
        );
      case 'soundcloud':
        return (
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${embedId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            title={`SoundCloud: ${title}`}
          ></iframe>
        );
      default:
        return <p>Unsupported music platform</p>;
    }
  };

  return <div className="music-player-embed mb-3">{renderEmbed()}</div>;
}
