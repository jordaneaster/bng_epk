/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['rzdoygryvifvcmhhbiaq.supabase.co'], // Add any external domains if needed
    // Increase the size limit if you have large images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
