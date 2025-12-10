import { source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export default async function TagPage(props: PageProps<'/notes/tags/[tag]'>) {
  const params = await props.params;
  // 在静态导出模式下，Next.js 会根据 generateStaticParams 生成的文件路径
  // 自动解码 URL 参数，所以 params.tag 应该已经是解码后的值
  // 但为了兼容性，我们尝试解码（如果已经是解码后的值，decodeURIComponent 不会改变它）
  let tagName: string;
  try {
    tagName = decodeURIComponent(params.tag);
  } catch {
    // 如果解码失败（例如已经是解码后的值），直接使用
    tagName = params.tag;
  }
  
  // 获取所有页面
  const allPages = source.getPages();
  
  // 筛选包含该标签的页面
  const taggedPages = allPages.filter(page => {
    const tags = (page.data as any).tags;
    if (!tags || !Array.isArray(tags)) return false;
    return tags.some(tag => String(tag) === tagName);
  });
  
  if (taggedPages.length === 0) {
    notFound();
  }
  
  // 按发布时间或最后更新时间排序（如果有的话）
  taggedPages.sort((a, b) => {
    const dateA = a.data.publishedAt || a.data.lastUpdated;
    const dateB = b.data.publishedAt || b.data.lastUpdated;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const timeA = dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime();
    const timeB = dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime();
    
    return timeB - timeA; // 最新的在前
  });
  
  return (
    <DocsPage 
      full={true}
      tableOfContent={{
        enabled: false
      }}
      tableOfContentPopover={{
        enabled: false
      }}
      footer={{
        enabled: false
      }}
    >
      <DocsTitle>
        标签: {tagName}
        <span className="text-sm font-normal text-fd-muted-foreground ml-2">
          ({taggedPages.length} 篇文章)
        </span>
      </DocsTitle>
      <DocsBody>
        <div className="space-y-6">
          <Link 
            href="/notes/tags"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/50 rounded-md transition-colors no-underline"
          >
            ← 返回所有标签
          </Link>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {taggedPages.map((page) => {
              const publishedAt = page.data.publishedAt instanceof Date
                ? page.data.publishedAt
                : page.data.publishedAt
                  ? new Date(page.data.publishedAt)
                  : undefined;
              const lastUpdated = page.data.lastUpdated instanceof Date
                ? page.data.lastUpdated
                : page.data.lastUpdated
                  ? new Date(page.data.lastUpdated)
                  : undefined;
              
              return (
                <Link
                  key={page.url}
                  href={`/notes/${page.slugs && page.slugs.length > 0 ? page.slugs.join('/') : page.url}`}
                  className="group block p-6 rounded-xl border-2 border-fd-border bg-fd-card hover:border-fd-primary hover:bg-fd-primary/5 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 no-underline"
                >
                  <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors mb-2 line-clamp-2">
                    {page.data.title}
                  </h3>
                  {page.data.description && (
                    <p className="text-sm text-fd-muted-foreground mb-4 line-clamp-3">
                      {page.data.description}
                    </p>
                  )}
                  {(publishedAt || lastUpdated) && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-fd-muted-foreground pt-3 border-t border-fd-border">
                      {publishedAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <i className="fa-solid fa-calendar-day text-fd-muted-foreground/60" />
                          {publishedAt.toLocaleDateString('zh-CN')}
                        </span>
                      )}
                      {lastUpdated && publishedAt && lastUpdated.getTime() !== publishedAt.getTime() && (
                        <span className="inline-flex items-center gap-1.5">
                          <i className="fa-regular fa-clock text-fd-muted-foreground/60" />
                          {lastUpdated.toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const allPages = source.getPages();
  const tagSet = new Set<string>();
  
  for (const page of allPages) {
    const tags = (page.data as any).tags;
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        tagSet.add(String(tag));
      }
    }
  }
  
  // 返回编码后的值，以匹配链接中的 encodeURIComponent
  // 这样在开发和生产模式下都能正常工作
  return Array.from(tagSet).map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata(
  props: PageProps<'/notes/tags/[tag]'>,
): Promise<Metadata> {
  const params = await props.params;
  let tagName: string;
  try {
    tagName = decodeURIComponent(params.tag);
  } catch {
    tagName = params.tag;
  }
  
  const allPages = source.getPages();
  const taggedPages = allPages.filter(page => {
    const tags = (page.data as any).tags;
    if (!tags || !Array.isArray(tags)) return false;
    return tags.some(tag => String(tag) === tagName);
  });
  
  return {
    title: `标签: ${tagName}`,
    description: `包含标签 "${tagName}" 的 ${taggedPages.length} 篇文章`,
  };
}

