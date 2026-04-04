"use client";

import Image from 'next/image';
import Script from 'next/script';
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimateOnScroll from '../../components/motion/AnimateOnScroll';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight, lineGrow } from '../../lib/animations';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowRight, FaTicketAlt } from 'react-icons/fa';

async function getLiveEvents() {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data) return { upcoming: [], past: [] };

    const upcoming = data.filter(event => event.date >= currentDate);
    const past = data.filter(event => event.date < currentDate);
    return { upcoming, past };
  } catch (err) {
    return { upcoming: [], past: [] };
  }
}

export default function LiveEvents() {
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [pastShows, setPastShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { upcoming, past } = await getLiveEvents();
        setUpcomingShows(upcoming);
        setPastShows(past);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const nextShow = upcomingShows && upcomingShows.length > 0 ? upcomingShows[0] : null;

  const eventData = nextShow ? {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `BNG NappSakk at ${nextShow.venue}`,
    startDate: nextShow.date,
    location: {
      '@type': 'Place',
      name: nextShow.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: nextShow.city,
        addressRegion: nextShow.state,
      },
    },
    performer: { '@type': 'MusicGroup', name: 'BNG NappSakk' },
    offers: {
      '@type': 'Offer',
      url: nextShow.ticket_link || '',
      price: nextShow.price || '',
      priceCurrency: 'USD',
      availability: nextShow.sold_out ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    image: nextShow.flyer_image,
  } : null;

  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: 'rgba(255,255,255,0.3)',
        fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
        textTransform: 'uppercase', letterSpacing: '0.2em',
      }}>
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading Events
        </motion.span>
      </div>
    );
  }

  return (
    <>
      {eventData && (
        <Script id="schema-event" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }} />
      )}

      {/* Hero */}
      <section className="live-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="hero-label">Experience</span>
            <h1>Live <span className="text-gradient-gold">Shows</span></h1>
            <p className="hero-sub">
              Raw energy. Authentic Wilkinsburg sound. BNG NappSakk live on stage.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="live-content">
        {/* Featured Next Show */}
        {nextShow ? (
          <section className="featured-section section">
            <div className="container">
              <motion.div
                className="featured-card"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div className="featured-image" variants={fadeInLeft}>
                  {nextShow.flyer_image && (
                    <Image
                      src={nextShow.flyer_image}
                      alt={`BNG NappSakk at ${nextShow.venue}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 450px"
                      priority
                    />
                  )}
                  <div className="featured-image-overlay" />
                  <span className="next-badge">Next Show</span>
                </motion.div>

                <motion.div className="featured-details" variants={fadeInRight}>
                  <h2 className="event-name">{nextShow.title}</h2>

                  <div className="event-meta-grid">
                    <div className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      <div>
                        <span className="meta-primary">{nextShow.venue}</span>
                        <span className="meta-secondary">{nextShow.city}, {nextShow.state}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      <div>
                        <span className="meta-primary">
                          {new Date(nextShow.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        {nextShow.time && <span className="meta-secondary">{nextShow.time}</span>}
                      </div>
                    </div>
                  </div>

                  {nextShow.description && <p className="event-desc">{nextShow.description}</p>}

                  <div className="cta-row">
                    {nextShow.sold_out ? (
                      <span className="sold-out-tag">Sold Out</span>
                    ) : (
                      <a href={nextShow.ticket_link} target="_blank" rel="noopener noreferrer" className="btn ticket-btn">
                        <FaTicketAlt /> Get Tickets
                        {nextShow.price && <span className="ticket-price">{nextShow.price}</span>}
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        ) : (
          <section className="no-shows section">
            <div className="container">
              <AnimateOnScroll>
                <div className="no-shows-card">
                  <div className="no-shows-icon">🎵</div>
                  <h2>No Upcoming Shows</h2>
                  <p>BNG NappSakk is in the studio. Follow for announcements.</p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {/* Upcoming Shows Grid */}
        {upcomingShows && upcomingShows.length > 1 && (
          <section className="upcoming-section section">
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-heading">More <span className="text-gradient-gold">Shows</span></h2>
              </AnimateOnScroll>
              <motion.div
                className="shows-grid"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {upcomingShows.slice(1).map((show, i) => (
                  <motion.div key={i} className="show-card" variants={fadeInUp}>
                    {show.flyer_image && (
                      <div className="show-thumb">
                        <Image src={show.flyer_image} alt={`${show.venue}`} fill style={{ objectFit: 'cover' }} sizes="350px" />
                        <div className="show-thumb-overlay" />
                      </div>
                    )}
                    <div className="show-body">
                      <h3>{show.title}</h3>
                      <div className="show-meta">
                        <span><FaMapMarkerAlt /> {show.venue}</span>
                        <span>{show.city}, {show.state}</span>
                        <span><FaCalendarAlt /> {new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {!show.sold_out && show.ticket_link && (
                        <a href={show.ticket_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline show-cta">
                          Tickets <FaArrowRight />
                        </a>
                      )}
                      {show.sold_out && <span className="sold-out-small">Sold Out</span>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Gold Divider */}
        {pastShows && pastShows.length > 0 && (
          <AnimateOnScroll variants={lineGrow} style={{ transformOrigin: 'center' }}>
            <hr className="gold-divider" />
          </AnimateOnScroll>
        )}

        {/* Past Shows */}
        {pastShows && pastShows.length > 0 && (
          <section className="past-section section">
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-heading">Previous <span className="text-gradient-gold">Performances</span></h2>
              </AnimateOnScroll>
              <motion.div
                className="past-grid"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {[...pastShows].reverse().slice(0, 6).map((show, i) => (
                  <motion.div key={i} className="past-card" variants={fadeInUp}>
                    {show.flyer_image && (
                      <div className="past-thumb">
                        <Image src={show.flyer_image} alt={`${show.venue}`} fill style={{ objectFit: 'cover' }} sizes="350px" />
                        <div className="past-thumb-overlay">
                          <span className="past-badge">Completed</span>
                        </div>
                      </div>
                    )}
                    <div className="past-body">
                      <h4>{show.title}</h4>
                      <p className="past-venue">{show.venue} — {show.city}, {show.state}</p>
                      <p className="past-date">{new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .live-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .live-hero::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
        }
        .hero-label {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-primary, #f0b429);
          margin-bottom: 0.75rem;
        }
        .live-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 0.5rem;
        }
        .hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.45);
          max-width: 500px;
          margin: 0 auto;
        }

        .live-content { background: #0a0a0a; }

        /* Featured */
        .featured-card {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          background: #141414;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          min-height: 450px;
        }
        .featured-image {
          position: relative;
          min-height: 400px;
        }
        .featured-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 50%, rgba(20,20,20,0.6) 100%);
        }
        .next-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.35rem 0.8rem;
          border-radius: 4px;
          background: var(--color-primary, #f0b429);
          color: #000;
          z-index: 2;
        }
        .featured-details {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .event-name {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #fff;
          margin: 0 0 1.5rem;
          line-height: 1.15;
        }
        .event-meta-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .meta-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .meta-item :global(.meta-icon) {
          color: var(--color-primary, #f0b429);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }
        .meta-primary {
          display: block;
          font-weight: 600;
          color: #fff;
          font-size: 0.95rem;
        }
        .meta-secondary {
          display: block;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
        }
        .event-desc {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .ticket-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-primary, #f0b429);
          color: #000;
          font-weight: 700;
        }
        .ticket-price {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-left: 0.25rem;
        }
        .sold-out-tag {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background: rgba(255,68,68,0.1);
          color: #ff4444;
          border: 1px solid rgba(255,68,68,0.2);
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Section Heading */
        .section-heading {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 2.5rem;
          color: #fff;
        }

        /* No Shows */
        .no-shows-card {
          text-align: center;
          padding: 4rem 2rem;
          background: #141414;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .no-shows-icon { font-size: 3rem; margin-bottom: 1rem; }
        .no-shows-card h2 { font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem; }
        .no-shows-card p { color: rgba(255,255,255,0.45); }

        /* Shows Grid */
        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: 1.5rem;
        }
        .show-card {
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .show-card:hover {
          transform: translateY(-4px);
          border-color: rgba(240,180,41,0.12);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .show-thumb {
          position: relative;
          width: 100%;
          padding-top: 60%;
          overflow: hidden;
        }
        .show-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #141414 0%, transparent 50%);
        }
        .show-body {
          padding: 1.25rem;
        }
        .show-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.75rem;
        }
        .show-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 1rem;
        }
        .show-meta :global(svg) {
          color: var(--color-primary, #f0b429);
          margin-right: 0.35rem;
        }
        .show-cta { font-size: 0.8rem; }
        .sold-out-small {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #ff4444;
        }

        /* Past Shows */
        .past-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
          gap: 1.25rem;
        }
        .past-card {
          background: #111;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.03);
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .past-card:hover { opacity: 1; }
        .past-thumb {
          position: relative;
          width: 100%;
          padding-top: 65%;
        }
        .past-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .past-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: rgba(255,255,255,0.12);
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          color: #fff;
        }
        .past-body { padding: 1rem; }
        .past-body h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin: 0 0 0.3rem;
        }
        .past-venue {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin: 0 0 0.15rem;
        }
        .past-date {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .shows-grid, .past-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
            margin: 0 auto;
          }
        }
        @media (max-width: 768px) {
          .live-hero { padding: 6.5rem 0 2rem; }
          .featured-card {
            grid-template-columns: 1fr;
          }
          .featured-image {
            min-height: 280px;
          }
          .shows-grid, .past-grid {
            max-width: 400px;
          }
        }
        @media (max-width: 480px) {
          .live-hero h1 { font-size: 2rem; }
          .featured-details { padding: 1.5rem; }
        }
      `}</style>
    </>
  );
}
