/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生成独立的 Docker 部署文件夹，极大地减小镜像体积
  output: 'standalone',
  
  // 严格模式，有助于在开发阶段捕获潜在问题
  reactStrictMode: true,

  // 图片优化配置（如果后续有远程图片资源，需要在此添加域名）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // 开启 Gzip 压缩
  compress: true,

  // 自定义响应头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 实验性功能配置（如需）
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@monaco-editor/react'],
  },
};

export default nextConfig;
