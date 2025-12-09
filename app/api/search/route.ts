import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// 创建搜索API实例，包含GET和staticGET方法
const { GET, staticGET } = createFromSource(source, {
  // 配置中文支持
  components: {
    tokenizer: createTokenizer(),
  },
  search: {
    threshold: 0,
    tolerance: 0,
  },
});

// 在静态导出模式下使用staticGET作为GET处理程序
export { staticGET as GET };

// 配置路由为静态可渲染
export const dynamic = 'force-static';
export const revalidate = false;
