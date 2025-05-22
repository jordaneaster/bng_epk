'use client';

import { useCallback } from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaEnvelope, FaTiktok } from 'react-icons/fa';

export default function ShareButtons({ title, url }) {
  // Platform-specific sharing handlers
  const handleTwitterShare = (e) => {
    e.preventDefault();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  const handleFacebookShare = (e) => {
    e.preventDefault();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=626,height=436');
  };

  const handleInstagramShare = (e) => {
    e.preventDefault();
    
    // Try to open Instagram app with deep linking
    // This attempts to open the Instagram app if installed
    const instagramAppUrl = `instagram://camera`;
    
    // First try to open the app
    const tryInstagramApp = window.open(instagramAppUrl, '_self');
    
    // If opening the app fails or after a delay, inform the user
    setTimeout(() => {
      alert("Opening Instagram. Please add this content to your story or post.\n\nTo share on Instagram:\n1. Open Instagram\n2. Create a new post or story\n3. Add this link in your caption or story sticker: " + url);
    }, 500);
  };

  const handleTikTokShare = (e) => {
    e.preventDefault();
    
    // Try to open TikTok app with deep linking
    const tikTokAppUrl = `tiktok://`;
    
    // First try to open the app
    const tryTikTokApp = window.open(tikTokAppUrl, '_self');
    
    // If opening the app fails or after a delay, inform the user
    setTimeout(() => {
      alert("Opening TikTok. To share this content on TikTok:\n1. Create a new video\n2. Add this link in your caption: " + url);
    }, 500);
  };

  const handleEmailShare = (e) => {
    e.preventDefault();
    const emailBody = `Check out this article: ${title}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;
  };

  // Try native sharing if available
  const handleNativeShare = useCallback((e, platform) => {
    e.preventDefault();
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this article: ${title}`,
        url: url
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fall back to platform-specific sharing
        if (platform === 'twitter') handleTwitterShare(e);
        else if (platform === 'facebook') handleFacebookShare(e);
        else if (platform === 'instagram') handleInstagramShare(e);
        else if (platform === 'tiktok') handleTikTokShare(e);
        else if (platform === 'email') handleEmailShare(e);
      });
      return true;
    }
    return false;
  }, [title, url]);
  
  return (
    <div className="flex space-x-4">
      <button
        onClick={(e) => {
          const shared = handleNativeShare(e, 'twitter');
          if (!shared) handleTwitterShare(e);
        }}
        className="share-button twitter" 
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
      >
        <FaTwitter size={20} />
      </button>
      
      <button
        onClick={(e) => {
          const shared = handleNativeShare(e, 'facebook');
          if (!shared) handleFacebookShare(e);
        }}
        className="share-button facebook" 
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <FaFacebook size={20} />
      </button>
      
      <button
        onClick={(e) => {
          const shared = handleNativeShare(e, 'instagram');
          if (!shared) handleInstagramShare(e);
        }}
        className="share-button instagram" 
        title="Share on Instagram"
        aria-label="Share on Instagram"
      >
        <FaInstagram size={20} />
      </button>
      
      <button
        onClick={(e) => {
          const shared = handleNativeShare(e, 'tiktok');
          if (!shared) handleTikTokShare(e);
        }}
        className="share-button tiktok" 
        title="Share on TikTok"
        aria-label="Share on TikTok"
      >
        <FaTiktok size={20} />
      </button>
      
      <button
        onClick={(e) => {
          const shared = handleNativeShare(e, 'email');
          if (!shared) handleEmailShare(e);
        }}
        className="share-button email" 
        title="Share via Email"
        aria-label="Share via Email"
      >
        <FaEnvelope size={20} />
      </button>
    </div>
  );
}
