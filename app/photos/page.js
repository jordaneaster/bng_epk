import ImageGrid from '../../components/ImageGrid';
import { createClient } from '@supabase/supabase-js';
import { getPublicFileUrl } from '../../lib/supabaseUtils';

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
      sortBy: { column: 'name', order: 'asc' },
    });

  if (listError) {
    console.error('Error listing files:', listError);
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
      alt: file.name // Use filename as alt text
    };
  }).filter(image => image.url !== null);

  return images;
}

export default async function Photos() {
  const photos = await fetchImages();

  return (
      // Add padding to the main container and a title
      <div className="container mx-auto px-4 py-8">
        {/* Removed mb-4 from here as padding is handled by the container */}
        <div>
          <ImageGrid images={photos} />
        </div>
      </div>
  );
}
