'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { fadeInUp } from '@/lib/animations';

function AnimatedCounter({ end, label, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
  };

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <span className="stat-number text-gradient-gold">
        {formatNumber(count)}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

export default function CredibilityBanner({
  stats = [
    { end: 500000, label: 'Total Streams', suffix: '+' },
    { end: 15000, label: 'Monthly Listeners', suffix: '+' },
  ],
  pressLogos = [
    'SXSW',
    'Roc Nation',
    'DMG Worldwide',
    'DJConnect Pro',
    'Zaytoven',
  ],
}) {
  return (
    <section className="credibility-banner">
      {/* Press ticker */}
      <div className="ticker-wrapper">
        <div className="ticker-label">As Seen With</div>
        <div className="ticker-track">
          <div className="ticker-content">
            {[...pressLogos, ...pressLogos, ...pressLogos].map((name, i) => (
              <span key={i} className="ticker-item">
                {name}<span className="ticker-dot">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((stat, i) => (
          <AnimatedCounter key={i} end={stat.end} label={stat.label} suffix={stat.suffix} />
        ))}
      </div>

      <style jsx>{`
        .credibility-banner {
          position: relative;
          padding: 2.5rem 0;
          background: linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          overflow: hidden;
        }

        .ticker-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          overflow: hidden;
          padding: 0 clamp(2rem, 6vw, 4rem);
        }

        .ticker-label {
          flex-shrink: 0;
          white-space: nowrap;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
          padding-right: 1rem;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ticker-track {
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }

        .ticker-content {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          white-space: nowrap;
          animation: ticker-scroll 25s linear infinite;
        }

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          white-space: nowrap;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.65);
          padding: 0 1.5rem;
        }

        .ticker-dot {
          display: inline-block;
          color: var(--color-primary);
          font-size: 0.35rem;
          vertical-align: middle;
          margin-left: 1.5rem;
          opacity: 0.7;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: clamp(2rem, 6vw, 5rem);
          max-width: 800px;
          margin: 0 auto;
          padding: 0 clamp(2rem, 6vw, 4rem);
        }

        .stats-row :global(.stat-item) {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.25rem;
        }

        .stats-row :global(.stat-number) {
          font-family: var(--font-heading);
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 900;
          line-height: 1;
        }

        .stats-row :global(.stat-label) {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .ticker-item {
            font-size: 0.8rem;
            padding: 0 1rem;
          }
          .ticker-dot {
            margin-left: 1rem;
          }
          .stats-row {
            gap: 1.5rem;
          }
          .ticker-label {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
