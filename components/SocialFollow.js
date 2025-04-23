'use client';

import { useEffect, useState } from 'react';
import TrackableLink from './TrackableLink';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './SocialFollow.module.css';
import { FaSpotify, FaSoundcloud, FaYoutube, FaInstagram, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

export default function SocialFollow({ compact = false, vertical = false }) {
  const { event } = useAnalytics();

  const socialLinks = [
    {
      platform: 'Spotify',
      href: 'https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe',
      icon: <FaSpotify />,
    },
    {
      platform: 'Apple Music',
      href: 'https://music.apple.com/us/artist/bng-nappsakk/1599225835',
      icon: <SiApplemusic />,
    },
    {
      platform: 'SoundCloud',
      href: 'https://soundcloud.com/search?q=bng%20nappsakk',
      icon: <FaSoundcloud />,
    },
    {
      platform: 'YouTube',
      href: 'https://www.youtube.com/@bngnappsakk',
      icon: <FaYoutube />,
    },
    {
      platform: 'Instagram',
      href: 'https://www.instagram.com/p/DIjZF9FRTyG/',
      icon: <FaInstagram />,
    },
    {
      platform: 'Twitter',
      href: 'https://x.com/BNG_Nappsakk',
      icon: <FaTwitter />,
    },
    {
      platform: 'Facebook',
      href: 'https://www.facebook.com/napp.sakk.9',
      icon: <FaFacebook />,
    },
    {
      platform: 'TikTok',
      href: 'https://www.tiktok.com/@bng_nappsakk',
      icon: <FaTiktok />,
    },
  ];

  return (
    <div className={`
      ${styles.socialFollow} 
      ${compact ? styles.compact : ''} 
      ${vertical ? styles.vertical : ''}
    `}>
      <ul className={styles.socialList}>
        {socialLinks.map(({ platform, href, icon }) => {
          return (
            <li key={platform} className={styles.socialItem}>
              <TrackableLink
                href={href}
                eventName="social_follow"
                eventParams={{ platform }}
                target="_blank"
                aria-label={`Follow us on ${platform}`}
                className={styles.socialLink}
              >
                {icon}
              </TrackableLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
