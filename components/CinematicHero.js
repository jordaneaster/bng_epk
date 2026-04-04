'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpotify, FaApple, FaYoutube, FaVolumeUp, FaVolumeMute, FaChevronDown } from 'react-icons/fa';
import { heroStagger, heroTextReveal } from '@/lib/animations';
import { trackClickEvent } from '@/lib/gtag';

export default function CinematicHero({
  artistName = 'BNG NappSakk',
  tagline = 'Hip-Hop Visionary | Performer | Cultural Storyteller',
  videoUrl = '/videos/hero-background.mp4',
  fallbackImageUrl = '/images/hero-bg.jpg',
  latestRelease,
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const handleStreamingClick = (platform) => {
    if (!latestRelease) return;
    trackClickEvent('hero_streaming_click', { platform, track: latestRelease.title });
  };

  const getImageSrc = () => {
    if (!latestRelease?.imageUrl) return '/images/default-cover.jpg';
    const url = latestRelease.imageUrl;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
    return '/images/default-cover.jpg';
  };

  return (
    <section className="cinematic-hero">
      {/* Background Video / Image */}
      <div className="hero-bg">
        {!isVideoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="hero-video"
            onError={() => setIsVideoError(true)}
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={fallbackImageUrl}
            alt={artistName}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        )}

        {/* Multi-layer overlay */}
        <div className="hero-overlay" />
        <div className="hero-grain" />
      </div>

      {/* Hero Content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="hero-content"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <div className="hero-inner">
              {/* Left: Artist info + release */}
              <div className="hero-left">
                <motion.h1
                  className="hero-artist-name"
                  variants={heroTextReveal}
                >
                  {artistName}
                </motion.h1>

                <motion.p className="hero-tagline" variants={heroTextReveal}>
                  {tagline}
                </motion.p>

                {latestRelease && (
                  <motion.div className="hero-release" variants={heroTextReveal}>
                    <div className="release-card glass">
                      <div className="release-artwork">
                        {imageError ? (
                          <div className="artwork-fallback">
                            {latestRelease.title?.charAt(0) || '♪'}
                          </div>
                        ) : (
                          <Image
                            src={getImageSrc()}
                            alt={latestRelease.title || 'Latest Release'}
                            width={140}
                            height={140}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            onError={() => setImageError(true)}
                          />
                        )}
                      </div>

                      <div className="release-info">
                        <span className="release-badge">Latest Drop</span>
                        <h2 className="release-title">{latestRelease.title}</h2>
                        <div className="streaming-pills">
                          {latestRelease.spotify_link && (
                            <Link
                              href={latestRelease.spotify_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="stream-pill spotify"
                              onClick={() => handleStreamingClick('spotify')}
                            >
                              <FaSpotify /> Spotify
                            </Link>
                          )}
                          {latestRelease.apple_music_link && (
                            <Link
                              href={latestRelease.apple_music_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="stream-pill apple"
                              onClick={() => handleStreamingClick('apple')}
                            >
                              <FaApple /> Apple
                            </Link>
                          )}
                          {latestRelease.youtube_link && (
                            <Link
                              href={latestRelease.youtube_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="stream-pill youtube"
                              onClick={() => handleStreamingClick('youtube')}
                            >
                              <FaYoutube /> YouTube
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div className="hero-ctas" variants={heroTextReveal}>
                  <Link href="/music" className="btn hero-btn-primary">
                    Explore Music
                  </Link>
                  <Link href="/contact" className="btn btn-outline hero-btn-secondary">
                    Book NappSakk
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute toggle */}
      {!isVideoError && (
        <button
          onClick={toggleMute}
          className="mute-btn glass"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      )}

      {/* Scroll indicator */}
      <motion.button
        className="scroll-indicator"
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        aria-label="Scroll down"
      >
        <span className="scroll-text">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaChevronDown />
        </motion.span>
      </motion.button>

      <style jsx global>{`
        .cinematic-hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          width: 100%;
          color: #fff;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-bg :global(.hero-video) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 0.3) 0%,
            rgba(10, 10, 10, 0.15) 30%,
            rgba(10, 10, 10, 0.5) 60%,
            rgba(10, 10, 10, 0.92) 100%
          );
          z-index: 1;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
          z-index: 2;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 80px;
          padding-bottom: 0;
          padding-left: clamp(2.5rem, 8vw, 5rem);
          padding-right: clamp(2.5rem, 8vw, 5rem);
        }

        .hero-inner {
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .hero-left {
          flex: 1;
          max-width: 720px;
        }

        .hero-artist-name {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff 0%, #f0b429 50%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: heroGradient 6s ease-in-out infinite;
        }

        @keyframes heroGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-tagline {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 2rem;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .hero-release {
          margin-bottom: 2rem;
        }

        .release-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          border-radius: 12px;
          max-width: 520px;
        }

        .release-artwork {
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          width: 100px;
          height: 100px;
        }

        .artwork-fallback {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: var(--color-primary);
          border-radius: 8px;
        }

        .release-info {
          flex: 1;
          min-width: 0;
        }

        .release-badge {
          display: inline-block;
          background: #ff3c00;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }

        .release-title {
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .streaming-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .stream-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .stream-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          color: white;
        }

        .stream-pill.spotify { background: rgba(29, 185, 84, 0.85); }
        .stream-pill.spotify:hover { background: #1DB954; }
        .stream-pill.apple { background: rgba(250, 87, 193, 0.85); }
        .stream-pill.apple:hover { background: #FA57C1; }
        .stream-pill.youtube { background: rgba(255, 0, 0, 0.85); }
        .stream-pill.youtube:hover { background: #FF0000; }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          font-size: 0.9rem;
          padding: 0.9rem 2rem;
        }

        .hero-btn-secondary {
          font-size: 0.9rem;
          padding: 0.9rem 2rem;
          border-color: rgba(255, 255, 255, 0.3);
          color: #fff;
        }

        .hero-btn-secondary:hover {
          border-color: var(--color-primary);
          background: rgba(240, 180, 41, 0.1);
          color: var(--color-primary);
        }

        .mute-btn {
          position: absolute;
          bottom: 100px;
          right: 2rem;
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 1.1rem;
          border: none;
          transition: all 0.3s ease;
        }

        .mute-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: color 0.3s ease;
          font-size: 0.9rem;
        }

        .scroll-indicator:hover {
          color: var(--color-primary);
        }

        .scroll-text {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-family: var(--font-heading);
        }

        @media (max-width: 768px) {
          .cinematic-hero {
            min-height: 100svh;
          }

          .hero-content {
            padding-left: 2rem;
            padding-right: 2rem;
          }

          .hero-inner {
            flex-direction: column;
          }

          .hero-left {
            max-width: 100%;
          }

          .release-card {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }

          .streaming-pills {
            justify-content: center;
          }

          .hero-ctas {
            justify-content: center;
          }

          .mute-btn {
            bottom: 120px;
            right: 1rem;
          }

          .release-artwork {
            width: 80px;
            height: 80px;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
