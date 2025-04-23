import ImageGrid from '../../components/ImageGrid';
import { createClient } from '@supabase/supabase-js'; // Assuming you have supabase client configured

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
    const { data: publicUrlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(`${folderPath}/${file.name}`);

    return {
      url: publicUrlData.publicUrl,
      alt: file.name // Use filename as alt text
    };
  });

  return images;
}

export default async function Photos() { // Make the component async
  const photos = await fetchImages(); // Fetch images

  return (
      <div className="container">
        <h1 className="text-center mb-4">Photos</h1>
        
        <div className="mb-4">
          <ImageGrid images={photos} />
        </div>
      </div>
  );
}
