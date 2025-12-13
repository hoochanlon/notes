import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { FileText, Archive, Tag as TagIcon } from 'lucide-react';
import { SiteCard } from './site-card';
import { siteLinks } from './site-links';

export const metadata: Metadata = {
  title: '网站导航',
  description: '常用网站导航，快速访问搜索引擎和常用站点',
};

export default function LinksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">网站导航</h1>
        <div className="flex flex-col gap-4 mb-10">
          <p className="text-fd-muted-foreground">
            常用网站导航，方便快速访问搜索引擎和常用站点。
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
              href="/notes"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
            >
              <Archive className="w-4 h-4" />
              查看归档
            </Link>
            <Link
              href="/notes/tags"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
            >
              <TagIcon className="w-4 h-4" />
              查看标签
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {siteLinks.map((category) => (
            <section key={category.category} className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {category.category}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.sites.map((site) => (
                  <SiteCard key={site.url} site={site} />
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

