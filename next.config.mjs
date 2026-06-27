/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds — eslint-config-next has compatibility issues
  // with ESLint v9 flat config. Run `npm run lint` separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For dummy data
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com', // For dummy data
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // For dummy data
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
