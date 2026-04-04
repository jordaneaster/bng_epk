import ImageGrid from '../../components/ImageGrid';
import { createClient } from '@supabase/supabase-js';
import { getPublicFileUrl } from '../../lib/supabaseUtils';
import styles from './photos.module.css';
import { createBaseMetadata } from '../../lib/seo';

// Export metadata for this page
export const metadata = createBaseMetadata({
  title: 'Photo Gallery - BNG Music Entertainment',
  description: 'Browse official photos, press images, and more from BNG Music Entertainment.',
  path: '/photos',
  ogImage: '/images/hero-bg.jpg',
});

// Initialize Supabase client (replace with your actual URL and anon key, preferably from env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchImages() {
  const bucketName = 'gallery-images';
  const folderPath = 'bng';

  const { data: fileList, error: listError } = await supabase
    .storage
    .from(bucketName)
    .list(folderPath, {
      limit: 100, // Adjust limit as needed
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (listError) {
    return [];
  }

  if (!fileList || fileList.length === 0) {
    return [];
  }

  // Filter out potential placeholder files if Supabase adds them
  const imageFiles = fileList.filter(file => !file.name.startsWith('.'));

  const images = imageFiles.map(file => {
    const imageUrl = getPublicFileUrl(bucketName, `${folderPath}/${file.name}`);

    return {
      url: imageUrl,
      alt: file.name, // Use filename as alt text
      objectFit: 'contain', // Preserves aspect ratio while filling container
      className: 'rounded shadow-md' // Optional styling improvements
    };
  }).filter(image => image.url !== null);

  return images;
}

export default async function Photos() {
  const photos = await fetchImages();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .photos-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: radial-gradient(ellipse at top, rgba(240, 180, 41, 0.08), transparent 60%);
        }
        .photos-hero .label {
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.85rem;
          color: var(--color-primary, #f0b429);
          margin-bottom: 1rem;
        }
        .photos-hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #f0b429, #f7d070);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
        }
        .photos-hero .subtitle {
          color: var(--color-text-muted, #a0a0a0);
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .gallery-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .photos-hero { padding: 6.5rem 0 2rem; }
        }
        @media (max-width: 480px) {
          .photos-hero h1 { font-size: 2rem; }
        }
      ` }} />

      <section className="photos-hero">
        <div className="container">
          <p className="label">Gallery</p>
          <h1>Photo Gallery</h1>
          <p className="subtitle">Official photos, press images & behind the scenes</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={`gallery-section ${styles.galleryContainer}`}>
            <ImageGrid images={photos} />
          </div>
        </div>
      </section>
    </>
  );
}
