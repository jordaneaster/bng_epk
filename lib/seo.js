// Utility functions for SEO metadata and structured data

// Generate base metadata object for all pages
export function createBaseMetadata({
  title = 'BNG Music',
  description = 'Official website for BNG Music.',
  path = '',
  ogImage = '/images/hero-bg.jpg',
}) {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const fullUrl = path ? `${url}${path}` : url;
  
  return {
    title,
    description,
    metadataBase: new URL(url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'BNG Music',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@bngmusic',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Add these helper functions to make metadata implementation easier across pages

// Helper function specifically for metadata descriptions
export function createMetaDescription(text, maxLength = 160) {
  // Strip HTML tags if any
  const strippedText = text.replace(/<[^>]*>?/gm, '');
  
  // Truncate to maxLength characters without cutting words
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  
  // Find a good breakpoint (space) near the maxLength
  let breakpoint = strippedText.lastIndexOf(' ', maxLength);
  if (breakpoint === -1) breakpoint = maxLength;
  
  return `${strippedText.substring(0, breakpoint)}...`;
}

// Enhanced base metadata with more SEO properties
export function createEnhancedMetadata({
  title = 'BNG Music',
  description = 'Official website for BNG Music.',
  path = '',
  ogImage = '/images/hero-bg.jpg',
  keywords = 'BNG Music, hip-hop, music, artist',
  type = 'website',
}) {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://bngmusicentertainment.com';
  const fullUrl = path ? `${url}${path}` : url;
  
  return {
    title,
    description,
    keywords, // Add keywords metadata
    metadataBase: new URL(url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'BNG Music',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@bngmusic',
      site: '@bngmusic',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Create JSON-LD for MusicGroup schema
export function createMusicGroupSchema(data = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'BNG Music',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/artist.jpg`,
    description: data.description || 'Official website for BNG Music.',
    ...data,
  };
}

// Create JSON-LD for MusicAlbum schema
export function createMusicAlbumSchema(album) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: album.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'BNG Music',
    },
    ...album,
  };
}
