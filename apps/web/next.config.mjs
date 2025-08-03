/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment optimization
  output: 'standalone',
  
  // Turborepo monorepo packages
  transpilePackages: [
    '@eot/ui',
    '@eot/identity',
    '@eot/organizations',
    '@eot/storage',
    '@eot/integrations',
    '@eot/analytics',
    '@eot/audit',
  ],
  
  // Server external packages (moved from experimental)
  serverExternalPackages: ['@eot/core'],
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@eot/ui',
      '@eot/identity',
      '@eot/organizations',
      '@eot/storage',
      '@eot/integrations',
      '@eot/analytics',
      '@eot/audit',
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Static optimization
  staticPageGenerationTimeout: 180,
  
  // Bundle optimization (swcMinify is now default in Next.js 15)
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}.js',
      preventFullImport: true,
    },
  },
  
  // Runtime configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@eot/core/server': false,
        '@eot/core/client': '@eot/core',
      };
    }
    
    // Bundle analysis in development
    if (dev && !isServer) {
      config.optimization.concatenateModules = false;
    }
    
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;