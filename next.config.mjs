import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// basePath 必须为空字符串或以斜杠开头的子路径，不能为单独的 "/"
// 若部署在根域名，保持为空字符串；若部署在子路径（如 /notes），改成对应子路径
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // 启用静态导出模式
  output: 'export',
  // GitHub Pages 子路径配置
  // 在静态导出模式下，basePath 会自动处理所有资源路径
  basePath,
  // 添加尾部斜杠，有助于静态文件生成
  trailingSlash: true,
  // 设置环境变量，供客户端使用
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // 静态导出模式下必须禁用图片优化
    unoptimized: true,
    // 正确写法（Next.js 15 最新要求）
    remotePatterns: [
      // 放开所有 https 图片（开发/文档站最方便）
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 开发服务器性能优化
  ...(process.env.NODE_ENV === 'development' && {
    // 减少开发时的编译范围
    experimental: {
      // 优化 Turbopack 性能（如果使用）
      turbo: {
        resolveAlias: {
          // 可以添加别名优化
        },
      },
    },
  }),
};

export default withMDX(config);
