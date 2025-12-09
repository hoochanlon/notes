import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Mermaid } from '@/components/mdx/mermaid';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...TabsComponents,
    Mermaid,
    img: (props: any) => {
      // 如果没有 width 或 height，提供默认值
      // 使用较大的默认尺寸，让图片自适应容器
      const width = props.width || 1200;
      const height = props.height || 800;
      return <ImageZoom {...props} width={width} height={height} />;
    },
    TypeTable,
    ...components,
  };
}