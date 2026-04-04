import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { createEnhancedMetadata, createMetaDescription } from '@/lib/seo';

export const metadata = createEnhancedMetadata({
  title: 'Blog & News - BNG NappSakk',
  description: 'Stay updated with the latest news, music releases, performances, and stories from BNG NappSakk.',
  path: '/blog',
  keywords: 'BNG music blog, hip-hop news, music industry, BNG NappSakk updates, music releases',
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function EmptyState() {
  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <span className="hero-label">Stories &amp; Updates</span>
          <h1>Blog &amp; <span className="text-gradient-gold">News</span></h1>
          <p className="hero-sub">Latest from BNG NappSakk</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Coming Soon</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>
            We&apos;re working on exciting content. Check back soon for updates, music news, and stories.
          </p>
        </div>
      </section>
      <BlogStyles />
    </div>
  );
}

function BlogStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .blog-page { background: #0a0a0a; min-height: 100vh; }

      .blog-hero {
        padding: 8rem 0 3rem;
        text-align: center;
        background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
        position: relative;
      }
      .blog-hero::after {
        content: '';
        position: absolute;
        bottom: 0; left: 20%; right: 20%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
      }
      .blog-page .hero-label {
        display: inline-block;
        font-size: 0.7rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.2em;
        color: var(--color-primary, #f0b429);
        margin-bottom: 0.75rem;
      }
      .blog-hero h1 {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 900; color: #fff; margin: 0 0 0.5rem;
      }
      .blog-page .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.45); margin: 0; }

      .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
        gap: 1.5rem;
        max-width: 1080px;
        margin: 0 auto;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .post-card {
        background: #141414;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.04);
        transition: transform 0.3s ease, border-color 0.3s ease;
        animation: blogFadeUp 0.5s ease both;
      }
      .post-card:hover {
        transform: translateY(-4px);
        border-color: rgba(240,180,41,0.15);
      }

      .post-card a { text-decoration: none; display: block; }

      .post-thumb {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: #1a1a1a;
      }
      .post-thumb img {
        transition: transform 0.4s ease;
      }
      .post-card:hover .post-thumb img {
        transform: scale(1.05);
      }

      .post-body { padding: 1.5rem; }
      .post-date {
        display: block;
        font-size: 0.7rem; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.08em;
        color: var(--color-primary, #f0b429);
        margin-bottom: 0.5rem;
      }
      .post-title {
        font-size: 1.1rem; font-weight: 700; color: #fff;
        line-height: 1.4; margin: 0 0 0.6rem;
        transition: color 0.2s;
      }
      .post-card:hover .post-title { color: var(--color-primary, #f0b429); }
      .post-excerpt {
        font-size: 0.85rem; color: rgba(255,255,255,0.45);
        line-height: 1.6; margin: 0 0 1rem;
        display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
      }
      .read-link {
        font-size: 0.8rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.06em;
        color: var(--color-primary, #f0b429);
      }

      @keyframes blogFadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .posts-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
      }
      @media (max-width: 480px) {
        .blog-hero { padding: 6.5rem 0 2rem; }
        .blog-hero h1 { font-size: 2rem; }
      }
    `}} />
  );
}

export default async function Blog() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !posts || posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <span className="hero-label">Stories &amp; Updates</span>
          <h1>Blog &amp; <span className="text-gradient-gold">News</span></h1>
          <p className="hero-sub">Latest from BNG NappSakk</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="posts-grid">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="post-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="post-thumb">
                    <Image
                      src={(post.featured_image || '/images/blog-placeholder.jpg').trim()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="post-body">
                    <span className="post-date">{formatDate(post.published_at)}</span>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{createMetaDescription(post.excerpt || post.content, 120)}</p>
                    <span className="read-link">Read Article &rarr;</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BlogStyles />
    </div>
  );
}
