// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mhumpgmhvamsizrrsopq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
        pathname: "/img/component-images/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/for-contributors/guidelines",
        destination: "/legal/contributor-guidelines",
      },
      { source: "/trust-safety", destination: "/legal/trust-and-safety" },
      { source: "/terms", destination: "/legal/terms-of-service" },
      { source: "/privacy", destination: "/legal/privacy-policy" },
    ];
  },
};

module.exports = nextConfig;
