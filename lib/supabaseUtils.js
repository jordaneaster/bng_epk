import { supabase } from './supabaseClient'; // Assuming you have initialized client here

/**
 * Uploads a file to a Supabase Storage bucket with Cache-Control headers.
 * @param {string} bucketName - The name of the Supabase Storage bucket.
 * @param {string} filePath - The path where the file will be stored in the bucket.
 * @param {File} file - The file object to upload.
 * @param {number} cacheDurationSeconds - How long the file should be cached (in seconds).
 */
export const uploadFileWithCacheControl = async (bucketName, filePath, file, cacheDurationSeconds = 31536000) => { // Default: 1 year
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: `public, max-age=${cacheDurationSeconds}`,
      upsert: false, // Set to true to overwrite existing files if needed
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  console.log('File uploaded successfully:', data);
  return data;
};

/**
 * Gets the public URL for a file in a Supabase Storage bucket.
 * This URL should leverage the CDN if configured.
 * @param {string} bucketName - The name of the Supabase Storage bucket.
 * @param {string} filePath - The path of the file within the bucket.
 */
export const getPublicFileUrl = (bucketName, filePath) => {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
      console.error('Error getting public URL for:', filePath);
      return null;
  }

  return data.publicUrl;
};

// Example Usage (within your component or upload logic):
/*
import { uploadFileWithCacheControl, getPublicFileUrl } from './utils/supabaseUtils';

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const bucket = 'your-public-bucket-name'; // e.g., 'images'
  const timestamp = Date.now();
  const uniqueFilePath = `uploads/${timestamp}-${file.name}`;
  const oneWeekInSeconds = 60 * 60 * 24 * 7;

  const uploadResult = await uploadFileWithCacheControl(bucket, uniqueFilePath, file, oneWeekInSeconds);

  if (uploadResult) {
    const publicUrl = getPublicFileUrl(bucket, uniqueFilePath);
    console.log('Public URL:', publicUrl);
    // Now you can use this publicUrl in your application (e.g., in an <img> tag)
    // <img src={publicUrl} alt="Uploaded content" />
  }
}
*/
