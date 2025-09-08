/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'img.youtube.com'],
  },
  async rewrites() {
    return [
      {
        source: '/webhook',
        destination: '/api/webhooks/stripe',
      },
    ]
  },
};

export default nextConfig;
