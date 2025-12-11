import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Callout } from 'fumadocs-ui/components/callout';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { cn } from 'fumadocs-ui/utils/cn';
import { Card as FdCard } from 'fumadocs-ui/components/card';
import Link from 'fumadocs-core/link';
import { Mermaid } from '@/components/mdx/mermaid';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...TabsComponents,
    // 调整 Callout：根据是否有标题分别控制内边距/行距/图标垂直偏移
    Callout: ({ className, title, ...rest }) => {
      const hasTitle = Boolean(title);
      const body = hasTitle
        ? 'my-3 py-2.5 [&_svg]:my-0 [&_svg]:mt-1.5'
        : '[&>div:last-child]:my-0';
      return (
        <Callout
          {...rest}
          title={title}
          className={cn(body, className)}
        />
      );
    },
    // 让 Card 的图标与标题同排显示
    Card: ({ icon, title, description, href, className, children, ...rest }) => {
      const E = href ? Link : 'div';
      return (
        <E
          {...rest}
          href={href}
          data-card
          className={cn(
            'block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full',
            href && 'hover:bg-fd-accent/80',
            className,
          )}
        >
          <div className="not-prose mb-2 flex items-center gap-2">
            {icon && (
              <div className="shadow-md rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground [&_svg]:size-4">
                {icon}
              </div>
            )}
            {title && <h3 className="my-0 text-sm font-medium">{title}</h3>}
          </div>
          {description && (
            <p className="my-0! text-sm text-fd-muted-foreground">{description}</p>
          )}
          <div className="text-sm text-fd-muted-foreground prose-no-margin empty:hidden">
            {children}
          </div>
        </E>
      );
    },
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