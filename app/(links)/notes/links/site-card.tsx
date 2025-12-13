'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { SiteIcon } from './site-icon';
import type { Site } from './site-links';

interface SiteCardProps {
  site: Site;
}

/**
 * 使用 microlink.io API 获取网站的 title 和 description
 * API 文档: https://microlink.io/docs/api/getting-started/overview
 */
interface MicrolinkData {
  title?: string;
  description?: string;
}

async function fetchDataFromMicrolink(url: string): Promise<MicrolinkData> {
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&data=title,description`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      return {
        title: data.data.title,
        description: data.data.description,
      };
    }
    
    return {};
  } catch (error) {
    console.error(`获取 ${url} 的数据失败:`, error);
    return {};
  }
}

// 检查 name 是否需要自动获取（undefined 或空字符串）
function needsAutoFetchName(value: string | undefined): boolean {
  return value === undefined || (value !== null && value.trim() === '');
}

// 检查 description 是否需要自动获取
// undefined: 需要自动获取
// 空字符串: 不需要获取，也不显示
// 有值: 直接使用
function needsAutoFetchDescription(value: string | undefined): boolean {
  return value === undefined;
}

export function SiteCard({ site }: SiteCardProps) {
  const [name, setName] = useState<string | undefined>(site.name);
  const [description, setDescription] = useState<string | undefined>(site.description);
  
  // description 是空字符串表示"没有描述"，不需要获取
  const needsName = needsAutoFetchName(site.name);
  const needsDescription = needsAutoFetchDescription(site.description);
  const [isLoading, setIsLoading] = useState(needsName || needsDescription);

  useEffect(() => {
    // 计算是否需要获取
    const shouldFetchName = needsAutoFetchName(site.name);
    const shouldFetchDescription = needsAutoFetchDescription(site.description);
    
    // 如果 name 和 description 都不需要获取，直接返回
    if (!shouldFetchName && !shouldFetchDescription) {
      setIsLoading(false);
      return;
    }

    // 使用 microlink.io API 自动获取 title 和 description
    fetchDataFromMicrolink(site.url)
      .then((data) => {
        if (data.title && shouldFetchName) {
          setName(data.title);
        }
        // 只有 description 是 undefined 时才自动获取，空字符串不获取
        if (data.description && shouldFetchDescription) {
          setDescription(data.description);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [site.url, site.name, site.description]);

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-xl border-2 border-fd-border bg-fd-card hover:border-fd-primary hover:bg-fd-primary/5 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 no-underline flex flex-col h-full"
    >
      <div className="flex items-start gap-3 mb-3 flex-1">
        <SiteIcon icon={site.icon} name={name || site.url} />
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors line-clamp-1 mb-1 flex items-center gap-2">
            {isLoading && !name ? (
              <span className="italic">正在加载...</span>
            ) : (
              name || site.name || site.url
            )}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </h3>
          <div className="flex-1 min-h-[40px]">
            {(() => {
              // description 是空字符串，不显示任何内容
              if (site.description === '') {
                return null;
              }
              // 正在加载且需要获取 description
              if (isLoading && needsAutoFetchDescription(site.description)) {
                return (
                  <p className="text-sm text-fd-muted-foreground line-clamp-2 italic">
                    正在加载描述...
                  </p>
                );
              }
              // 有 description 则显示
              if (description) {
                return (
                  <p className="text-sm text-fd-muted-foreground line-clamp-2">
                    {description}
                  </p>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-fd-border">
        <p className="text-xs text-fd-muted-foreground truncate font-mono">
          {site.url}
        </p>
      </div>
    </a>
  );
}

