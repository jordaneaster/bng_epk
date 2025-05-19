/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Add your Supabase domain here
      'sdnmjbqhclrzzxcjwtrk.supabase.co',
      'xnfdhoszwrneeajlnoco.supabase.co', // This is an example - use your actual Supabase domain
      'supabase.co',
      'lxpyjvqzobcbydojwhov.supabase.co',
      'supabasestorage.com',
      'rzdoygryvifvcmhhbiaq.supabase.co',
    ],
  },
}

module.exports = nextConfig
