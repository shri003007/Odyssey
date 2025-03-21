/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google user profile images
      'lh3.google.com',             // Alternate Google image domain
      'googleusercontent.com',      // Base Google content domain
      'ui-avatars.com',             // UI Avatars for default user images
    ],
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig

