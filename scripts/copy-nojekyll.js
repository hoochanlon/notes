const fs = require('fs');
const path = require('path');

// 确保 .nojekyll 文件被复制到 out 目录
const sourceFile = path.join(__dirname, '../public/.nojekyll');
const destFile = path.join(__dirname, '../out/.nojekyll');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✓ Copied .nojekyll to out directory');
} else {
  // 如果源文件不存在，创建一个空的 .nojekyll 文件
  fs.writeFileSync(destFile, '');
  console.log('✓ Created .nojekyll in out directory');
}

