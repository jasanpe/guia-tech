const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Configuración adicional para ESLint
  eslint: {
    // Desactivar la validación de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  // Desactivar la comprobación de tipos durante el build
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig