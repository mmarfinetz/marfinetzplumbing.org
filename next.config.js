/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const useStaticExport = process.env.USE_STATIC_EXPORT === 'true';

const nextConfig = isDev || !useStaticExport ? {
  // Development configuration
  reactStrictMode: true,
  swcMinify: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Only process these as pages
  env: {
    BUILD_ID: new Date().getTime().toString(),
    IS_NEXT_APP: 'true',
  },
} : {
  // Production configuration
  output: 'export',  // This will generate static HTML/CSS/JS
  distDir: 'out',    // Explicitly set the output directory
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Only process these as pages
  images: {
    unoptimized: true // Required for static export
  },
  // Ensure we can still use the calculator route
  basePath: '',
  trailingSlash: true,
  env: {
    BUILD_ID: new Date().getTime().toString(),  // Force new build each time
    IS_NEXT_APP: 'true',
  },
  // Exclude static HTML files from the build to avoid conflicts
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'calculator.html',
        'contact-form.html',
        'js/calculator.js',
        'js/recharts-init.js',
      ],
    },
  },
  // Clean up .next folder before builds to ensure no contamination
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 1,
  },
}

module.exports = nextConfig 
