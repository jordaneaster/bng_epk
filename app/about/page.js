import Image from 'next/image';
import Link from 'next/link';
import { createBaseMetadata } from '../../lib/seo';
import { FaInstagram, FaYoutube, FaSpotify, FaApple, FaEnvelope, FaMapMarkerAlt, FaMusic, FaCalendarAlt } from 'react-icons/fa';

export const metadata = createBaseMetadata({
  title: 'About BNG NappSakk - Artist Bio',
  description: 'Learn about BNG NappSakk — a rising hip-hop artist from Wilkinsburg, PA putting Pittsburgh on the map with real bars and authentic street narratives.',
  path: '/about',
  ogImage: '/images/bng-nappsakk-hero.jpg',
});

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="hero-label">The Artist</span>
          <h1>BNG <span className="text-gradient-gold">NappSakk</span></h1>
          <p className="hero-sub">Hip-Hop / Rap &bull; Wilkinsburg, PA &bull; BNG Music Entertainment</p>
        </div>
      </section>

      {/* Bio + Image */}
      <section className="bio-section section">
        <div className="container">
          <div className="bio-grid">
            <div className="bio-image-col">
              <div className="bio-image-wrap">
                <Image
                  src="/images/bng-nappsakk-hero.jpg"
                  alt="BNG NappSakk"
                  width={480}
                  height={600}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  priority
                />
              </div>
              {/* Quick stats */}
              <div className="stat-row">
                <div className="stat-item">
                  <FaMapMarkerAlt />
                  <span>Wilkinsburg, PA</span>
                </div>
                <div className="stat-item">
                  <FaMusic />
                  <span>Hip-Hop / Rap</span>
                </div>
              </div>
            </div>

            <div className="bio-text-col">
              <blockquote className="pull-quote">
                &ldquo;BNG NappSakk is more than just an artist — he&rsquo;s a voice for the trenches,
                putting Pittsburgh on the map with real bars and real presence.&rdquo;
              </blockquote>

              <p>
                BNG NappSakk is a rising hip-hop artist from Pittsburgh, Pennsylvania, who has been making waves in the rap scene with his authentic street narratives and powerful delivery. Representing BNG Music Entertainment, NappSakk brings a unique blend of lyrical prowess and raw energy that resonates with listeners who appreciate genuine storytelling in hip-hop.
              </p>
              <p>
                His music is characterized by vivid storytelling that paints pictures of street life, personal struggles, and triumphs. NappSakk&rsquo;s ability to weave complex narratives with hard-hitting beats has earned him recognition in the underground hip-hop community and beyond. His recent collaborations and performances have solidified his position as an artist to watch in the coming years.
              </p>
              <p>
                With an upcoming album hosted by legendary rapper Jadakiss, BNG NappSakk is poised to take his career to the next level. His dedication to authentic expression and unwavering commitment to his craft continues to set him apart in a crowded field of emerging artists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Release */}
      <section className="release-section section">
        <div className="container">
          <h2 className="section-title">Latest <span className="text-gradient-gold">Release</span></h2>
          <div className="release-card">
            <div className="release-video">
              <iframe
                src="https://www.youtube.com/embed/TfHF5NUX3fo?si=kZCm51hEAFFg4mEe"
                title="BNG NappSakk - Burn It Down (feat. Heemi)"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="release-info">
              <h3>&ldquo;Burn It Down&rdquo; <span>feat. Heemi</span></h3>
              <p className="release-credit">Shot by CaseFilms</p>
              <Link href="/videos" className="view-all-link">View all videos &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="connect-section section">
        <div className="container">
          <h2 className="section-title">Stay <span className="text-gradient-gold">Connected</span></h2>
          <div className="social-grid">
            <a href="https://instagram.com/bng_nappsakk" target="_blank" rel="noopener noreferrer" className="social-card ig">
              <FaInstagram />
              <span>Instagram</span>
            </a>
            <a href="https://youtube.com/@bngnappsakk" target="_blank" rel="noopener noreferrer" className="social-card yt">
              <FaYoutube />
              <span>YouTube</span>
            </a>
            <a href="https://open.spotify.com/artist/bng-nappsakk" target="_blank" rel="noopener noreferrer" className="social-card sp">
              <FaSpotify />
              <span>Spotify</span>
            </a>
            <a href="https://music.apple.com/artist/bng-nappsakk" target="_blank" rel="noopener noreferrer" className="social-card am">
              <FaApple />
              <span>Apple Music</span>
            </a>
          </div>

          <div className="business-cta">
            <FaEnvelope />
            <div>
              <h4>Business Inquiries</h4>
              <a href="mailto:contact@bngmusicentertainment.com">contact@bngmusicentertainment.com</a>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-page { background: #0a0a0a; min-height: 100vh; }

        .about-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .about-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
        }
        .hero-label {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--color-primary, #f0b429);
          margin-bottom: 0.75rem;
        }
        .about-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900; color: #fff; margin: 0 0 0.5rem;
        }
        .hero-sub {
          font-size: 0.95rem; color: rgba(255,255,255,0.45); margin: 0;
        }

        /* Bio Section */
        .bio-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 3rem;
          align-items: start;
          max-width: 960px;
          margin: 0 auto;
        }
        .bio-image-wrap {
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/5;
          background: #141414;
        }
        .stat-row {
          display: flex; gap: 1.5rem;
          margin-top: 1rem;
          justify-content: center;
        }
        .stat-item {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.8rem; color: rgba(255,255,255,0.5);
        }
        .stat-item svg { color: var(--color-primary, #f0b429); font-size: 0.75rem; }

        .pull-quote {
          font-size: 1.1rem;
          font-style: italic;
          color: rgba(255,255,255,0.65);
          border-left: 3px solid var(--color-primary, #f0b429);
          padding-left: 1.25rem;
          margin: 0 0 2rem;
          line-height: 1.7;
        }
        .bio-text-col p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.65);
          margin-bottom: 1.25rem;
        }

        /* Release Section */
        .section-title {
          font-size: 1.8rem; font-weight: 800; color: #fff;
          text-align: center; margin-bottom: 2rem;
        }
        .release-card {
          max-width: 720px;
          margin: 0 auto;
          background: #141414;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .release-video {
          position: relative;
          padding-top: 56.25%;
        }
        .release-video iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: 0;
        }
        .release-info {
          padding: 1.5rem 2rem;
        }
        .release-info h3 {
          font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0 0 0.25rem;
        }
        .release-info h3 span { color: rgba(255,255,255,0.45); font-weight: 400; }
        .release-credit {
          font-size: 0.8rem; color: rgba(255,255,255,0.35); margin: 0 0 0.75rem;
        }
        .view-all-link {
          font-size: 0.85rem; font-weight: 600;
          color: var(--color-primary, #f0b429);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .view-all-link:hover { opacity: 0.8; }

        /* Connect Section */
        .social-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 640px;
          margin: 0 auto 2.5rem;
        }
        .social-card {
          display: flex; flex-direction: column;
          align-items: center; gap: 0.5rem;
          padding: 1.5rem 1rem;
          background: #141414;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.04);
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem; font-weight: 600;
          transition: all 0.25s ease;
        }
        .social-card svg { font-size: 1.5rem; transition: color 0.25s ease; }
        .social-card.ig:hover { border-color: #E1306C40; }
        .social-card.ig:hover svg { color: #E1306C; }
        .social-card.yt:hover { border-color: #FF000040; }
        .social-card.yt:hover svg { color: #FF0000; }
        .social-card.sp:hover { border-color: #1DB95440; }
        .social-card.sp:hover svg { color: #1DB954; }
        .social-card.am:hover { border-color: #FA5740; }
        .social-card.am:hover svg { color: #FA57C1; }
        .social-card:hover { transform: translateY(-3px); color: #fff; }

        .business-cta {
          display: flex; align-items: center; gap: 1rem;
          max-width: 480px; margin: 0 auto;
          background: #141414;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .business-cta svg {
          font-size: 1.25rem;
          color: var(--color-primary, #f0b429);
          flex-shrink: 0;
        }
        .business-cta h4 {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          margin: 0 0 0.25rem;
        }
        .business-cta a {
          color: #fff; text-decoration: none;
          font-size: 0.9rem; font-weight: 600;
          transition: color 0.2s;
        }
        .business-cta a:hover { color: var(--color-primary, #f0b429); }

        @media (max-width: 768px) {
          .about-hero { padding: 6.5rem 0 2rem; }
          .bio-grid { grid-template-columns: 1fr; gap: 2rem; }
          .bio-image-wrap { max-width: 360px; margin: 0 auto; }
          .social-grid { grid-template-columns: repeat(2, 1fr); }
          .business-cta { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .about-hero h1 { font-size: 2rem; }
          .social-grid { grid-template-columns: 1fr; max-width: 300px; margin: 0 auto; }
        }
      ` }} />
    </div>
  );
}