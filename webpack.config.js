// Advanced webpack configuration for production optimization
const path = require('path')

/** @type {import('webpack').Configuration} */
module.exports = {
  // Production-specific optimizations
  optimization: {
    // Split chunks for better caching
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Framework chunks (React, Next.js)
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 20,
        },
        // UI libraries
        ui: {
          test: /[\\/]node_modules[\\/](@heroicons|lucide-react|framer-motion)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 15,
        },
        // Common components
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    
    // Tree shaking and dead code elimination
    usedExports: true,
    sideEffects: false,
    
    // Minification
    minimize: true,
    minimizer: [
      // Terser for JS minification (already included in Next.js)
      // CSS minification is handled by Next.js
    ],
  },

  // Module resolution optimizations
  resolve: {
    // Alias for shorter imports and better tree shaking
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
    },
    
    // Prefer ES modules for better tree shaking
    mainFields: ['es2015', 'module', 'main'],
    
    // Extension order for resolution
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  // Module rules
  module: {
    rules: [
      // TypeScript/JavaScript optimization
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { modules: false }], // Preserve modules for tree shaking
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
              plugins: [
                // Remove unused imports
                ['babel-plugin-transform-remove-unused-imports'],
                // Optimize React components
                ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
              ],
            },
          },
        ],
      },

      // Image optimization
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/,
        use: [
          {
            loader: 'next-optimized-images',
            options: {
              // Enable modern formats
              webp: true,
              avif: true,
              
              // Compression quality
              mozjpeg: {
                quality: 85,
              },
              pngquant: {
                quality: [0.65, 0.85],
              },
              
              // Responsive images
              responsive: {
                adapter: require('responsive-loader/sharp'),
                sizes: [320, 640, 960, 1200, 1800],
                quality: 85,
              },
            },
          },
        ],
      },
    ],
  },

  // Performance configuration
  performance: {
    // Set performance budgets
    maxEntrypointSize: 350 * 1024, // 350KB
    maxAssetSize: 250 * 1024,      // 250KB per asset
    
    // Hints for performance issues
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    
    // Filter which assets to analyze
    assetFilter: (assetFilename) => {
      // Ignore source maps and hot update files
      return !assetFilename.includes('.map') && 
             !assetFilename.includes('hot-update')
    },
  },

  // Development tools
  devtool: process.env.NODE_ENV === 'production' 
    ? 'source-map'        // Full source maps for production debugging
    : 'eval-source-map',  // Fast rebuilds in development

  // External dependencies (for CDN loading)
  externals: process.env.NODE_ENV === 'production' ? {
    // Load React from CDN in production (optional)
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
  } : {},

  // Plugins for advanced optimization
  plugins: [
    // Bundle analyzer (when ANALYZE=true)
    ...(process.env.ANALYZE ? [
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'static',
        reportFilename: '../bundle-analyzer-report.html',
        openAnalyzer: false,
      })
    ] : []),
    
    // Compression plugins (handled by Next.js but can be customized)
    ...(process.env.NODE_ENV === 'production' ? [
      // Additional production plugins can be added here
    ] : []),
  ],

  // Stats configuration for build output
  stats: {
    // Reduce build output noise
    chunks: false,
    chunkModules: false,
    modules: false,
    reasons: false,
    usedExports: false,
    providedExports: false,
    
    // Show important information
    assets: true,
    assetsSpace: 100,
    colors: true,
    errors: true,
    warnings: true,
    performance: true,
    timings: true,
  },
}

module.exports = (nextConfig) => {
  return {
    ...nextConfig,
    webpack: (config, options) => {
      // Merge with existing webpack config
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options)
      }

      // Apply our optimizations
      config.optimization = {
        ...config.optimization,
        ...module.exports.optimization,
      }

      config.resolve = {
        ...config.resolve,
        ...module.exports.resolve,
      }

      // Add performance configuration
      if (options.isServer === false) {
        config.performance = module.exports.performance
      }

      // Add bundle analyzer in development
      if (!options.isServer && process.env.ANALYZE === 'true') {
        config.plugins.push(
          new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
            analyzerMode: 'static',
            reportFilename: '../bundle-analyzer-report.html',
            openAnalyzer: true,
          })
        )
      }

      return config
    },
  }
}