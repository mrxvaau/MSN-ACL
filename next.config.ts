import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Disable ESLint during builds — eslint-config-next has compatibility issues
  // with ESLint v9 flat config. Run `npm run lint` separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};
export default nextConfig;
