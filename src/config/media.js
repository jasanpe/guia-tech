export const mediaConfig = {
    images: {
      domains: ['guia-tech.com', 'images.guia-tech.com'],
      defaultQuality: 75,
      formats: ['webp', 'jpg'],
      deviceSizes: [320, 480, 640, 800, 1024],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
      path: 'https://images.guia-tech.com',
      loader: 'default'
    },
    videos: {
      maxDuration: 60,
      maxSize: 10485760, // 10MB
      formats: ['mp4', 'webm']
    }
  }