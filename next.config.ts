import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No need for external packages with Turso - it's pure JavaScript
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for drizzle-orm vendor chunk issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Ensure proper handling of drizzle-orm
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('drizzle-orm');
    }
    
    return config;
  },
};

export default nextConfig;
