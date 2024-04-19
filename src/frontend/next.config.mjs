/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4566",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    domains: ['upload.wikimedia.org'],
  },
};

export default nextConfig;
