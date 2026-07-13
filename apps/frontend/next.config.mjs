import { resolveLanHosts } from './scripts/resolve-lan-host.mjs';

const lanHosts = resolveLanHosts();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow phones/tablets on the same Wi-Fi to load Turbopack dev assets.
  allowedDevOrigins: lanHosts,
  // Image optimization and security
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
      protocol: 'https',
      hostname: 'www.pexels.com', 
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Security headers
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    return [
      {
        source: '/api/auth/profile',
        destination: `${backendUrl}/auth/me`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  async headers() {
    // Strict CSP (especially upgrade-insecure-requests) breaks LAN dev over HTTP.
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            // NOTE (payments-agent): relaxed `script-src` and `frame-src` to
            // host Stripe Elements + PayPal Buttons. Keep the Stripe/PayPal
            // hosts allow-listed when hardening this further.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.paypal.com https://*.paypalobjects.com",
              "style-src 'self' 'unsafe-inline' https://*.paypal.com https://*.paypalobjects.com",
              "img-src 'self' https: data: blob:",
              "font-src 'self' data: https://*.paypal.com https://*.paypalobjects.com",
              "connect-src 'self' https: https://api.stripe.com https://*.paypal.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.paypal.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://*.paypal.com",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Production optimizations
  // swcMinify is enabled by default in Next.js 15
  
  // Bundle analyzer (optional)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
}

export default nextConfig
