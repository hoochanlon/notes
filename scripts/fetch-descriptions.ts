/**
 * 开发时辅助脚本：批量获取网站的 description
 * 
 * 使用方法：
 * 1. 在开发环境中运行: npx tsx scripts/fetch-descriptions.ts
 * 2. 或者: node --loader ts-node/esm scripts/fetch-descriptions.ts
 * 
 * 此脚本会读取 site-links.ts 中的所有网站，自动获取它们的 description
 * 并输出格式化的结果，方便复制到 site-links.ts 中
 */

import { fetchSiteDescription } from '../app/(links)/notes/links/site-utils';
import { siteLinks } from '../app/(links)/notes/links/site-links';

async function main() {
  console.log('开始获取网站描述...\n');

  const results: Array<{
    name: string;
    url: string;
    description?: string;
    fetched?: string;
  }> = [];

  for (const category of siteLinks) {
    for (const site of category.sites) {
      console.log(`正在获取: ${site.name} (${site.url})`);
      
      const fetched = await fetchSiteDescription(site.url);
      
      results.push({
        name: site.name,
        url: site.url,
        description: site.description,
        fetched: fetched || undefined,
      });

      if (fetched) {
        console.log(`  ✓ 获取成功: ${fetched}`);
      } else {
        console.log(`  ✗ 获取失败或未找到 description`);
      }
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n=== 结果汇总 ===\n');
  
  // 输出格式化的结果，方便复制
  for (const result of results) {
    if (result.fetched && !result.description) {
      console.log(`${result.name}:`);
      console.log(`  description: '${result.fetched}',`);
      console.log();
    }
  }

  // 输出完整的 createSite 调用格式
  console.log('\n=== 完整的 createSite 调用格式 ===\n');
  for (const category of siteLinks) {
    console.log(`// ${category.category}`);
    for (const site of category.sites) {
      const result = results.find(r => r.url === site.url);
      const desc = result?.fetched || result?.description;
      
      console.log(`createSite({`);
      console.log(`  name: '${site.name}',`);
      console.log(`  url: '${site.url}',`);
      if (desc) {
        console.log(`  description: '${desc}',`);
      }
      console.log(`}),`);
      console.log();
    }
  }
}

main().catch(console.error);

