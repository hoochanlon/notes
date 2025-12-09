import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkImage } from 'fumadocs-core/mdx-plugins';
import { z } from 'zod';

// 扩展 frontmatter schema：可选 slug、lastUpdated、toc 和 footer
const slugSchema = z.object({
  // slug 可以是字符串（单个路径段）或字符串数组（多个路径段）
  slug: z.union([z.string(), z.array(z.string())]).optional(),
  // 手动指定最近更新日期，ISO 字符串或可被 Date 解析的字符串
  lastUpdated: z.coerce.date().optional(),
  // 发布时间
  publishedAt: z.coerce.date().optional(),
  // 是否显示目录
  toc: z.boolean().optional(),
  // 是否显示页脚
  footer: z.boolean().optional(),
});
const customFrontmatterSchema = frontmatterSchema.merge(slugSchema);

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const notes = defineDocs({
  dir: 'content/notes',
  docs: {
    schema: customFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkMath,
      [
        remarkImage,
        {
          // 禁用远程图片尺寸获取，允许无限制使用 ![](url) 语法
          external: false,
          // 如果获取图片尺寸失败，忽略错误而不是抛出异常
          onError: 'ignore',
        },
      ],
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
