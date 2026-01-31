"use client";

import Image from 'next/image';
import Script from 'next/script';
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';

async function getLiveEvents() {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      return { upcoming: [], past: [] };
    }
    
    if (!data) {
      return { upcoming: [], past: [] };
    }
    
    // Separate events into upcoming and past
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

  // Get the next show (first upcoming event, if available)
  const nextShow = upcomingShows && upcomingShows.length > 0 ? upcomingShows[0] : null;
  
  // Create Event structured data for upcoming event
  const eventData = nextShow ? {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `BNG Music Entertainment at ${nextShow.venue}`,
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
    performer: {
      '@type': 'MusicGroup',
      name: 'BNG Music Entertainment',
    },
    offers: {
      '@type': 'Offer',
      url: nextShow.ticket_link || '',
      price: nextShow.price || '',
      priceCurrency: 'USD',
      availability: nextShow.sold_out ? 
        'https://schema.org/SoldOut' : 
        'https://schema.org/InStock',
    },
    image: nextShow.flyer_image,
  } : null;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
        <style jsx>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          }
          
          .loading-content {
            text-align: center;
            color: var(--color-text);
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #333;
            border-top: 3px solid var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {eventData && (
        <Script
          id="schema-event"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
        />
      )}
      
      {/* Hero Section */}
      <div className="live-events-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-main">BNG NappSakk</span>
              <span className="title-sub">Live Events</span>
            </h1>
            <p className="hero-description">
              Experience the raw energy and authentic Wilkinsburg sound live. 
              BNG NappSakk brings street narratives and hard-hitting beats to stages across the region.
            </p>
          </div>
        </div>
      </div>

      <div className="container live-events-content">
        {nextShow ? (
          /* Featured Event Section */
          <section className="featured-event">
            <div className="featured-event-container">
              <div className="event-image-section">
                <div className="event-image-wrapper">
                  <Image 
                    src={nextShow.flyer_image} 
                    alt={`BNG NappSakk performing at ${nextShow.venue} - ${nextShow.title}`}
                    width={400}
                    height={533}
                    className="event-image"
                    priority
                  />
                  <div className="live-badge">
                    <span>🎤 LIVE PERFORMANCE</span>
                  </div>
                </div>
                
                {/* Primary CTA positioned next to image */}
                <div className="primary-cta-section">
                  {nextShow.sold_out ? (
                    <div className="sold-out-badge">
                      <span className="sold-out-text">SOLD OUT</span>
                      <p className="sold-out-sub">This show has reached capacity</p>
                    </div>
                  ) : (
                    <div className="cta-wrapper">
                      <a 
                        href={nextShow.ticket_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="primary-cta-btn"
                      >
                        <span className="cta-text">Get Tickets Now</span>
                        <span className="cta-price">{nextShow.price || 'See pricing'}</span>
                      </a>
                      <p className="cta-urgency">Limited tickets available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="event-details-section">
                <div className="event-header">
                  <h2 className="event-title">{nextShow.title}</h2>
                  <div className="artist-highlight">
                    <span className="artist-name">BNG NappSakk</span>
                    <span className="artist-location">from Wilkinsburg, PA</span>
                  </div>
                </div>

                <div className="event-info-grid">
                  <div className="info-item venue-info">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <span className="info-label">Venue</span>
                      <span className="info-value">{nextShow.venue}</span>
                      <span className="info-extra">{nextShow.city}, {nextShow.state}</span>
                    </div>
                  </div>

                  <div className="info-item date-info">
                    <div className="info-icon">📅</div>
                    <div className="info-content">
                      <span className="info-label">Date & Time</span>
                      <span className="info-value">
                        {new Date(nextShow.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="info-extra">{nextShow.time}</span>
                    </div>
                  </div>
                </div>

                {nextShow.description && (
                  <div className="event-description">
                    <h3>About This Show</h3>
                    <p>{nextShow.description}</p>
                  </div>
                )}

                {/* Secondary CTA for mobile */}
                <div className="secondary-cta mobile-only">
                  {!nextShow.sold_out && (
                    <a 
                      href={nextShow.ticket_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="secondary-cta-btn"
                    >
                      Get Tickets Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* No Shows Section */
          <section className="no-shows-section">
            <div className="no-shows-content">
              <div className="no-shows-icon">🎵</div>
              <h2>No Upcoming Shows</h2>
              <p>BNG NappSakk is currently in the studio working on new material.</p>
              <p className="follow-text">Follow us to be the first to know when new shows are announced!</p>
              <div className="social-links">
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">YouTube</a>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Shows Grid */}
        {upcomingShows && upcomingShows.length > 1 && (
          <section className="upcoming-shows">
            <h2 className="section-title">More Upcoming Shows</h2>
            <div className="shows-grid">
              {upcomingShows.slice(1).map((show, index) => (
                <div key={index} className="show-card upcoming-show">
                  {show.flyer_image && (
                    <div className="show-image">
                      <Image
                        src={show.flyer_image}
                        alt={`BNG NappSakk at ${show.venue}`}
                        width={300}
                        height={200}
                        className="show-thumbnail"
                      />
                    </div>
                  )}
                  <div className="show-content">
                    <h3 className="show-title">{show.title}</h3>
                    <div className="show-details">
                      <p className="show-venue">{show.venue}</p>
                      <p className="show-location">{show.city}, {show.state}</p>
                      <p className="show-date">
                        {new Date(show.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    {!show.sold_out && (
                      <a 
                        href={show.ticket_link} 
                        className="show-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Tickets
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Shows Section */}
        {pastShows && pastShows.length > 0 && (
          <section className="past-shows">
            <h2 className="section-title">Previous Performances</h2>
            <p className="section-subtitle">
              Check out where BNG NappSakk has brought his signature sound to audiences.
            </p>
            <div className="shows-grid past-shows-grid">
              {pastShows.reverse().slice(0, 6).map((show, index) => (
                <div key={index} className="show-card past-show">
                  {show.flyer_image && (
                    <div className="show-image past-image">
                      <Image
                        src={show.flyer_image}
                        alt={`BNG NappSakk performed at ${show.venue}`}
                        width={300}
                        height={200}
                        className="show-thumbnail"
                      />
                      <div className="past-overlay">
                        <span className="past-badge">Completed</span>
                      </div>
                    </div>
                  )}
                  <div className="show-content">
                    <h3 className="show-title">{show.title}</h3>
                    <div className="show-details">
                      <p className="show-venue">{show.venue}</p>
                      <p className="show-location">{show.city}, {show.state}</p>
                      <p className="show-date">
                        {new Date(show.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Hero Section */
        .live-events-hero {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          padding: 4rem 0 3rem;
          text-align: center;
        }

        .hero-title {
          margin-bottom: 1.5rem;
        }

        .title-main {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
        }

        .title-sub {
          display: block;
          font-size: 2rem;
          font-weight: 400;
          color: var(--color-text);
          margin-top: 0.5rem;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #ccc;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Main Content */
        .live-events-content {
          padding: 3rem 0;
        }

        /* Featured Event */
        .featured-event {
          margin-bottom: 4rem;
        }

        .featured-event-container {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          display: grid;
          grid-template-columns: 350px 1fr;
          min-height: 500px;
        }

        .event-image-section {
          background: #000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .event-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 300px;
        }

        .event-image {
          width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .live-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: var(--color-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255,60,0,0.3);
        }

        .primary-cta-section {
          width: 100%;
          text-align: center;
        }

        .cta-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .primary-cta-btn {
          background: linear-gradient(135deg, var(--color-primary) 0%, #ff6600 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 10px 30px rgba(255,60,0,0.3);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .primary-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255,60,0,0.4);
        }

        .cta-text {
          font-size: 1.1rem;
        }

        .cta-price {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .cta-urgency {
          font-size: 0.8rem;
          color: #ff6600;
          margin: 0;
        }

        .sold-out-badge {
          background: #333;
          border: 2px solid #666;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .sold-out-text {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
          color: #ff4444;
          margin-bottom: 0.5rem;
        }

        .sold-out-sub {
          color: #999;
          font-size: 0.9rem;
          margin: 0;
        }

        /* Event Details */
        .event-details-section {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .event-header {
          margin-bottom: 2rem;
        }

        .event-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--color-text);
        }

        .artist-highlight {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .artist-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .artist-location {
          font-size: 1rem;
          color: #999;
        }

        .event-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .info-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.9rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .info-extra {
          font-size: 0.95rem;
          color: #ccc;
        }

        .event-description {
          margin-top: 1rem;
        }

        .event-description h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--color-text);
        }

        .event-description p {
          color: #ccc;
          line-height: 1.6;
        }

        /* Mobile CTA */
        .mobile-only {
          display: none;
        }

        .secondary-cta-btn {
          background: var(--color-primary);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          margin-top: 1.5rem;
          width: 100%;
          text-align: center;
        }

        /* No Shows Section */
        .no-shows-section {
          text-align: center;
          padding: 4rem 2rem;
          background: #1a1a1a;
          border-radius: 20px;
          margin-bottom: 3rem;
        }

        .no-shows-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .no-shows-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .no-shows-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--color-text);
        }

        .no-shows-content p {
          color: #ccc;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .follow-text {
          color: #999 !important;
          font-size: 1rem !important;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .social-link {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-primary);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--color-primary);
          color: white;
        }

        /* Shows Grid */
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
          color: var(--color-text);
        }

        .section-subtitle {
          text-align: center;
          color: #999;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .show-card {
          background: #1a1a1a;
          border-radius: 15px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #333;
        }

        .show-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }

        .show-image {
          position: relative;
          width: 100%;
          height: 150px;
          overflow: hidden;
        }

        .show-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .past-image {
          position: relative;
        }

        .past-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .past-badge {
          background: #666;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .show-content {
          padding: 1.5rem;
        }

        .show-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--color-text);
        }

        .show-details {
          margin-bottom: 1rem;
        }

        .show-venue {
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .show-location,
        .show-date {
          color: #999;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .show-cta {
          background: var(--color-primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .show-cta:hover {
          background: #ff6600;
          transform: translateY(-2px);
        }

        .past-show {
          opacity: 0.8;
        }

        .past-show .show-title,
        .past-show .show-venue {
          color: #999;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .featured-event-container {
            grid-template-columns: 1fr;
          }

          .event-image-section {
            flex-direction: row;
            padding: 1.5rem;
          }

          .event-image-wrapper {
            max-width: 200px;
          }

          .primary-cta-section {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .event-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .title-main {
            font-size: 2.5rem;
          }

          .title-sub {
            font-size: 1.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .featured-event-container {
            margin: 0 -1.5rem;
            border-radius: 0;
          }

          .event-image-section {
            flex-direction: column;
            text-align: center;
          }

          .event-image-wrapper {
            max-width: 250px;
          }

          .mobile-only {
            display: block;
          }

          .primary-cta-section {
            display: none;
          }

          .event-title {
            font-size: 2rem;
          }

          .shows-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
