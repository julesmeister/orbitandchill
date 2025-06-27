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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Development optimizations to reduce memory usage
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      workerThreads: false,
      cpus: 1,
    },
    // Reduce bundle size in development
    swcMinify: false,
    // Disable source maps in development to save memory
    productionBrowserSourceMaps: false,
  }),
  webpack: (config, { isServer, dev }) => {
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
    
    // Development memory optimizations
    if (dev) {
      // Reduce memory usage in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // Limit chunk size to ~244KB
            },
          },
        },
      };
      
      // Limit the number of concurrent webpack workers
      config.parallelism = 1;
      
      // Disable webpack cache to prevent memory accumulation
      config.cache = false;
    }
    
    return config;
  },
};

export default nextConfig;
