import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkImage } from 'fumadocs-core/mdx-plugins';
import { z } from 'zod';

// 扩展 frontmatter schema 以支持可选的 slug 字段
// slug 可以是字符串（单个路径段）或字符串数组（多个路径段）
// 在 zod v4 中，使用 merge 方法而不是 extend
const slugSchema = z.object({
  slug: z.union([z.string(), z.array(z.string())]).optional(),
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
  // Enable last modified timestamp injection via git
  plugins: [lastModified()],
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
