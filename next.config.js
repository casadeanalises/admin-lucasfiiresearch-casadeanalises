/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: [
      'investidor10.com.br',
      'google.com',
      'www.google.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'images.unsplash.com',
      'img.youtube.com',
      'cdn-icons-png.flaticon.com',
      'encrypted-tbn0.gstatic.com',
      'img.clerk.com',
      'www.lucasfiiresearch.com.br',
      'lucasfiiresearch.com.br',
      'drive.google.com',
      'drive.usercontent.google.com',
      'i.ibb.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
  },
  
  
  async headers() {
    return [
      {
        source: '/api/reports/pdfs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      
      {
        source: '/api/recommended-funds/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },


  webpack: (config, { isServer }) => {
    if (!isServer) {
     
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
      };
    }

    
    config.module.rules.push({
      test: /node_modules\/canvas/,
      use: 'null-loader'
    });

    // Otimizações para reduzir erros de build
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    return config;
  },


  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,


  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  staticPageGenerationTimeout: 60,
  
  experimental: {
    optimizeCss: true,
    workerThreads: false,
    cpus: 1
  },

  compiler: {
    styledComponents: true
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  trailingSlash: false,
  distDir: '.next',
  generateEtags: false,
  compress: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  }
};

module.exports = nextConfig; 
