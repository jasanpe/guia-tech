/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.amazon.com', 
      'cdn.pccomponentes.com', 
      'assets.mmsrg.com',
      'm.media-amazon.com'
    ],
    unoptimized: true
  },
  output: 'standalone',
}

export default nextConfig