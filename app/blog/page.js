import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { createEnhancedMetadata, createMetaDescription } from '@/lib/seo';

export const metadata = createEnhancedMetadata({
  title: 'Blog & News - BNG Music Entertainment',
  description: 'Stay updated with the latest news, music releases, performances, and stories from BNG Music Entertainment.',
  path: '/blog',
  keywords: 'BNG music blog, hip-hop news, music industry, BNG NappSakk updates, music releases',
});

// Format the date in a readable way
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function Blog() {
  // Fetch blog posts from Supabase
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching blog posts:', error);
  }
  
  // If no posts or error, show a message
  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Blog & News</h1>
        <div className="text-center py-12">
          <h2 className="text-2xl mb-4">Coming Soon</h2>
          <p className="text-gray-400">
            We're working on some exciting content. Check back soon for updates, music news, and stories from BNG Music Entertainment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog & News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="blog-card fade-in">
            <Link href={`/blog/${post.slug}`}>
              <div className="blog-image-container">
                <Image
                  src={post.featured_image || '/images/blog-placeholder.jpg'}
                  alt={post.title}
                  width={600}
                  height={340}
                  className="blog-image"
                />
              </div>
              <div className="blog-content">
                <span className="blog-date">{formatDate(post.published_at)}</span>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{createMetaDescription(post.excerpt || post.content, 120)}</p>
                <span className="read-more">Read More</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Add pagination if needed */}
    </div>
  );
}
