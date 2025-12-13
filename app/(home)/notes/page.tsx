import { source } from '@/lib/source';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { CalendarDays, Tag as TagIcon, FileText, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: '笔记归档',
  description: '按时间浏览所有笔记条目',
};

export default function NotesArchivePage() {
  const allPages = source.getPages();

  const entries = allPages
    .map((page) => {
      const dateValue = page.data.publishedAt || page.data.lastUpdated;
      const date =
        dateValue instanceof Date ? dateValue : dateValue ? new Date(dateValue) : null;
      return { page, date };
    })
    // 只保留有路径的页面，避免空页面
    .filter(({ page }) => !!page.url)
    // 按时间倒序，缺少日期的排在最后
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

  // 按年份分组
  const byYear = new Map<
    number | '未分类',
    Array<{
      title: string;
      href: string;
      description?: string;
      dateLabel?: string;
    }>
  >();

  for (const { page, date } of entries) {
    const year = date ? date.getFullYear() : '未分类';
    if (!byYear.has(year)) {
      byYear.set(year, []);
    }
    byYear.get(year)!.push({
      title: page.data.title,
      href: `/notes/${page.slugs && page.slugs.length > 0 ? page.slugs.join('/') : page.url}`,
      description: page.data.description,
      dateLabel: date ? date.toLocaleDateString('zh-CN') : undefined,
    });
  }

  // 年份降序（数字在前，“未分类”在最后）
  const years = Array.from(byYear.keys()).sort((a, b) => {
    if (a === '未分类') return 1;
    if (b === '未分类') return -1;
    return (b as number) - (a as number);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">归档</h1>
        <div className="flex flex-col gap-4 mb-10">
          <p className="text-fd-muted-foreground">
            按时间浏览全部笔记条目，方便快速跳转。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/notes/essay"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              返回备忘录
            </Link>
            <Link
              href="/notes/tags"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
            >
              <TagIcon className="w-4 h-4" />
              查看所有标签
            </Link>
            <Link
              href="/notes/links"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
            >
              <Globe className="w-4 h-4" />
              查看网站导航
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {years.map((year) => (
            <section key={year} className="space-y-4">
              <h2 className="text-2xl font-semibold">{year}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {byYear.get(year)!.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block p-5 rounded-xl border-2 border-fd-border bg-fd-card hover:border-fd-primary hover:bg-fd-primary/5 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 no-underline"
                  >
                    <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-2 min-h-[20px]">
                      {item.dateLabel && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">
                          <CalendarDays className="w-4 h-4 text-fd-muted-foreground/70" />
                          {item.dateLabel}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-fd-muted-foreground mt-2 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

