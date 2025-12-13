'use client';

import { useState } from 'react';

interface SiteIconProps {
  icon: string;
  name: string;
}

export function SiteIcon({ icon, name }: SiteIconProps) {
  const [imageError, setImageError] = useState(false);

  // 如果是 URL 或本地路径（以 / 开头），尝试显示图片
  const isImageUrl = icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/');
  
  if (isImageUrl && !imageError) {
    return (
      <img
        src={icon}
        alt={name}
        className="w-8 h-8 flex-shrink-0 object-contain rounded"
        onError={() => setImageError(true)}
      />
    );
  }

  // 如果图片加载失败或者是 emoji，显示文本/emoji
  return <span className="text-2xl flex-shrink-0">{imageError ? '🌐' : icon}</span>;
}

