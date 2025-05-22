import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { createEnhancedMetadata, createMetaDescription } from '@/lib/seo';
import { FaCalendarAlt, FaUser, FaTags, FaShareAlt } from 'react-icons/fa';
import CTAButton from '@/components/CTAButton';
import ShareButtons from '@/components/ShareButtons';

// Format the date in a readable way
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate metadata
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // Fetch the post to generate metadata
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
    
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.'
    };
  }
  
  // Create a clean description from content
  const description = createMetaDescription(post.excerpt || post.content);
  
  return createEnhancedMetadata({
    title: `${post.title} - BNG Music Entertainment Blog`,
    description,
    path: `/blog/${slug}`,
    ogImage: post.featured_image || '/images/blog-placeholder.jpg',
    keywords: post.tags?.join(', ') || 'BNG music, hip-hop, music blog',
    type: 'article',
  });
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  
  // Fetch the blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*, author:authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  
  if (error || !post) {
    notFound();
  }
  
  // Fetch related posts (posts with similar tags)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, featured_image, published_at')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3);
  
  // Get the full URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bngmusic.com';
  const fullUrl = `${baseUrl}/blog/${slug}`;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/blog" className="blog-back-link">
          &larr; Back to Blog
        </Link>
      </div>
      
      <article className="blog-post">
        <header className="blog-header">
          <h1 className="blog-title">{post.title}</h1>
          
          <div className="blog-meta">
            <span className="meta-item">
              <FaCalendarAlt /> {formatDate(post.published_at)}
            </span>
            
            {post.author && (
              <span className="meta-item">
                <FaUser /> {post.author.name}
              </span>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <span className="meta-item">
                <FaTags /> {post.tags.join(', ')}
              </span>
            )}
          </div>
        </header>
        
        {post.featured_image && (
          <div className="blog-featured-image">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1200}
              height={675}
              priority
            />
          </div>
        )}
        
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="blog-share mt-8 p-4 border-t border-b border-gray-700">
          <span className="share-label flex items-center mb-3"><FaShareAlt className="mr-2" /> Share this post:</span>
          <ShareButtons title={post.title} url={fullUrl} />
        </div>
        
        {/* CTA Section */}
        <div className="blog-cta">
          <h3>Listen to the latest from BNG Music</h3>
          <div className="cta-button-group">
            <CTAButton 
              type="spotify" 
              url="https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe"
              trackingId="blog_spotify_cta"
            />
            <CTAButton 
              type="apple" 
              url="https://music.apple.com/us/artist/bng-nappsakk/1599225835"
              trackingId="blog_apple_cta"
            />
          </div>
        </div>
      </article>
      
      {/* Related Posts Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="related-posts">
          <h3 className="related-posts-title">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(related => (
              <div key={related.id} className="related-post-card">
                <Link href={`/blog/${related.slug}`}>
                  <div className="related-post-image">
                    <Image
                      src={related.featured_image || '/images/blog-placeholder.jpg'}
                      alt={related.title}
                      width={400}
                      height={225}
                    />
                  </div>
                  <h4>{related.title}</h4>
                  <span className="related-post-date">{formatDate(related.published_at)}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
