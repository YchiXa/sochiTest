/** @type {import('next').NextConfig} */

module.exports = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'marketplace.canva.com',
         },
         {
            protocol: 'https',
            hostname: 'globaltv.es',
         },
         {
            protocol: 'https',
            hostname: 'lemanoosh.com',
         },
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      formats: ['image/webp'],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
   },
   async redirects() {
      return [
         {
            source: '/product',
            destination: '/products',
            permanent: true,
         },
      ]
   },
   // Увеличиваем таймаут для загрузки изображений
   experimental: {
      serverComponentsExternalPackages: ['sharp'],
   },
   // Настройки для оптимизации производительности
   poweredByHeader: false,
   reactStrictMode: true,
   swcMinify: true,
}
