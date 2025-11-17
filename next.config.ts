import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'img.freepik.com', 'www.tanishq.co.in', 'res.cloudinary.com', 'images.unsplash.com', 'images.pexels.com', 'cdn.shopify.com', 'cdn.caratlane.com'], // Add localhost for development and external image domains
  },
};

export default nextConfig;
