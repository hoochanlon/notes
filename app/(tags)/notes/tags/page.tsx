import { source } from '@/lib/source';
import type { Metadata } from 'next';
import Link from 'next/link';

export default async function TagsPage() {
  const allPages = source.getPages();

  const tagMap = new Map<string, Array<{ title: string; url: string; description?: string }>>();

  for (const page of allPages) {
    const pageData = page.data as any;
    const tags = pageData.tags;
    if (!tags) continue;

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim())
        : [tags];

    for (const tag of tagsArray) {
      const tagName = String(tag).trim();
      if (!tagName) continue;
      if (!tagMap.has(tagName)) {
        tagMap.set(tagName, []);
      }
      const pageUrl =
        page.slugs && page.slugs.length > 0 ? page.slugs.join('/') : page.url || '';
      tagMap.get(tagName)!.push({
        title: page.data.title,
        url: `/notes/${pageUrl}`,
        description: page.data.description,
      });
    }
  }

  const sortedTags = Array.from(tagMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], 'zh-CN'),
  );

  return (
    <section className="w-full">

      <h1 className="text-3xl font-semibold tracking-tight mb-2">所有标签</h1>
      <p className="text-fd-muted-foreground mb-8">浏览全部标签，快速跳转到相关笔记。</p>
      {sortedTags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-fd-muted-foreground text-lg">暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {sortedTags.map(([tag, pages]) => (
            <Link
              key={tag}
              href={`/notes/tags/${encodeURIComponent(tag)}/`}
              className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-fd-border bg-fd-card text-fd-card-foreground hover:border-fd-primary hover:bg-fd-primary/10 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 no-underline"
            >
              <span className="font-semibold text-base text-fd-foreground group-hover:text-fd-primary transition-colors">
                # {tag}
              </span>
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-bold rounded-full bg-fd-primary/20 text-fd-primary group-hover:bg-fd-primary group-hover:text-fd-primary-foreground transition-colors">
                {pages.length}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export const metadata: Metadata = {
  title: '所有标签',
  description: '浏览所有标签和相关的文章',
};

