/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        '*.mp4': {
          loaders: ['file-loader'],
        }
      }
    },
  },
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.(mp4|webm|ogg)$/,
  //     use: {
  //       loader: 'file-loader',
  //       options: {
  //         name: 'static/media/[name].[hash].[ext]',
  //         publicPath: '/_next/',
  //       },
  //     },
  //   });
  //   return config;
  // },

  async redirects() {
    return [
      {
        source: '/works/crying-trees',
        destination: '/works/crying-trees/index.html',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/works/crying-trees',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
