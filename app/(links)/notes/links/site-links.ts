import { createSite } from './site-utils';

// 网站导航数据类型定义
export interface Site {
  name?: string; // 可选，如果不提供会自动从 microlink.io API 获取 title
  url: string;
  description?: string; // 可选，如果不提供会自动从 microlink.io API 获取 description
  icon: string; // 可以是 emoji 或图片 URL
}

export interface SiteCategory {
  category: string;
  sites: Site[];
}

// 网站导航数据
// 使用 createSite 辅助函数，如果不提供 icon，会自动从 URL 生成 favicon URL
export const siteLinks: SiteCategory[] = [
  {
    category: '搜索 + AI',
    sites: [
      createSite({
          name: 'DuckDuckGo',
          url: 'https://duckduckgo.com/',
        //   description: '',
        // icon 会自动生成为 https://favicon.im/baidu.com
      }),
      createSite({
        // name: 'DeepSeek',
        url: 'https://chat.deepseek.com',
      }),
      createSite({
        name: 'grok',
        url: 'https://grok.com',
        icon: '/icons/grok.svg',
        description: 'grok is a search engine that uses AI to answer questions and help you find information.',
      }),
    ],
  },
  {
    category: '壁纸',
    sites: [
      createSite({
        name: '每日必应',
        url: 'https://dailybing.com/',
      }),
      createSite({
        name: 'Peapix',
        url: 'https://peapix.com/',
      }),
      createSite({
        name: '拾光壁纸',
        url: 'https://gallery.timeline.ink/',
      }),
    ],
  },
];

