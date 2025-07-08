/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove ignore flags for proper error checking
  eslint: {
    // Remove ignoreDuringBuilds: true
  },
  typescript: {
    // Remove ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'], // Add image domains
  },
  // Add proper environment variable handling
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Add proper headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
