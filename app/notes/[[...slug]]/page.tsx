import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/notes/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastUpdated = page.data.lastUpdated instanceof Date
    ? page.data.lastUpdated
    : page.data.lastUpdated
      ? new Date(page.data.lastUpdated)
      : undefined;
  const publishedAt = page.data.publishedAt instanceof Date
    ? page.data.publishedAt
    : page.data.publishedAt
      ? new Date(page.data.publishedAt)
      : undefined;

  return (
    <DocsPage 
      toc={page.data.toc} 
      full={page.data.full}
      tableOfContent={{
        enabled: page.data.toc !== false
      }}
      tableOfContentPopover={{
        enabled: page.data.toc !== false
      }}
      footer={{
        enabled: page.data.footer !== false
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {(publishedAt || lastUpdated) && (
        <p className="text-[15px] leading-6 text-fd-muted-foreground flex flex-wrap items-center gap-2">
          {publishedAt && (
            <span className="inline-flex items-center gap-1">
              <i className="fa-solid fa-calendar-day" />
              发布时间：{publishedAt.toLocaleDateString('zh-CN')}
            </span>
          )}
          {publishedAt && lastUpdated && <span className="mx-1">|</span>}
          {lastUpdated && (
            <span className="inline-flex items-center gap-1">
              <i className="fa-regular fa-clock" />
              最近更新：{lastUpdated.toLocaleDateString('zh-CN')}
            </span>
          )}
        </p>
      )}
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/notes/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
