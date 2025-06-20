import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="artist-image-container">
            <img 
              src="/images/bng-nappsakk-hero.jpg" 
              alt="BNG NappSakk" 
              className="artist-image"
            />
          </div>
          <div className="hero-text">
            <h1 className="artist-name">BNG NappSakk</h1>
            <p className="artist-tagline">Hip-Hop / Rap • Pittsburgh, PA</p>
            <p className="label">BNG Music Entertainment</p>            <p className="bio-line">
              &ldquo;BNG NappSakk is more than just an artist — he&rsquo;s a voice for the trenches, 
              putting Pittsburgh on the map with real bars and real presence.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="social-section">
        <div className="social-buttons">
          <a 
            href="https://instagram.com/bng_nappsakk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn instagram-btn"
          >
            <i className="fab fa-instagram"></i>
            Instagram
          </a>
          <a 
            href="https://youtube.com/@bngnappsakk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn youtube-btn"
          >
            <i className="fab fa-youtube"></i>
            YouTube
          </a>
          <a 
            href="https://www.bngmusicentertainment.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn website-btn"
          >
            <i className="fas fa-globe"></i>
            Official Website
          </a>
        </div>
      </section>      {/* Artist Bio */}
      <section className="bio-section">
        <div className="section-content">
          <h2>About the Artist</h2>
          <p>
            BNG NappSakk is a rising hip-hop artist from Pittsburgh, Pennsylvania, who has been making waves in the rap scene with his authentic street narratives and powerful delivery. Representing BNG Music Entertainment, NappSakk brings a unique blend of lyrical prowess and raw energy that resonates with listeners who appreciate genuine storytelling in hip-hop.
          </p>
          <p>
            His music is characterized by vivid storytelling that paints pictures of street life, personal struggles, and triumphs. NappSakk&rsquo;s ability to weave complex narratives with hard-hitting beats has earned him recognition in the underground hip-hop community and beyond. His recent collaborations and performances have solidified his position as an artist to watch in the coming years.
          </p>
          <p>
            With an upcoming album hosted by legendary rapper Jadakiss, BNG NappSakk is poised to take his career to the next level. His dedication to authentic expression and unwavering commitment to his craft continues to set him apart in a crowded field of emerging artists.
          </p>
          
          {/* Contact Information */}
          <div className="contact-info">
            <h3>Business Inquiries</h3>
            <p className="email-contact">
              <i className="fas fa-envelope"></i>
              <a href="mailto:contact@bngmusicentertainment.com">contact@bngmusicentertainment.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Latest Release */}
      <section className="video-section">
        <div className="section-content">
          <h2>Latest Release</h2>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/TfHF5NUX3fo?si=kZCm51hEAFFg4mEe"
              title="BNG NappSakk - Burn It Down (feat. Heemi)"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-info">
            <h3>&ldquo;Burn It Down&rdquo; featuring Heemi</h3>
            <p>Shot by CaseFilms</p>
          </div>
        </div>      </section>

      {/* Upcoming Events */}
      <section className="events-section">
        <div className="section-content">
          <h2>Upcoming Events</h2>
          <div className="event-card">
            <div className="event-date">
              <span className="month">JUN</span>
              <span className="day">26</span>
              <span className="year">2025</span>
            </div>
            <div className="event-details">
              <h3>Streets Most Wanted Tour</h3>
              <p className="event-location">Wheeling, WV</p>              <p className="event-description">
                Don&rsquo;t miss BNG NappSakk&rsquo;s explosive performance on the Streets Most Wanted Tour
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="section-content">
          <h2>Stay Connected</h2>
          <p>Follow BNG NappSakk for the latest music, videos, and tour updates</p>
          <div className="cta-buttons">
            <a 
              href="https://instagram.com/bng_nappsakk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-btn primary"
            >
              Follow on Instagram
            </a>
            <a 
              href="https://youtube.com/@bngnappsakk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-btn secondary"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;