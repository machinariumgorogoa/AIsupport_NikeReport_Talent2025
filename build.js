// 构建脚本：将多个内容部分合并为单个文件
const fs = require('fs');
const path = require('path');

// 配置
const config = {
  contentDir: './content',
  outputDir: './dist/content',
  parts: {
    en: ['en-content-part1.html', 'en-content-part2.html'],
    zh: ['zh-content-part1.html', 'zh-content-part2.html']
  }
};

// 确保输出目录存在
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// 合并函数
function mergeContentFiles(language, partFiles) {
  let combinedContent = '';
  
  partFiles.forEach(partFile => {
    const filePath = path.join(config.contentDir, partFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      combinedContent += content;
      console.log(`Added ${partFile} for ${language}`);
    } else {
      console.error(`File not found: ${filePath}`);
    }
  });
  
  // 写入合并后的文件
  const outputFilePath = path.join(config.outputDir, `${language}-content.html`);
  fs.writeFileSync(outputFilePath, combinedContent, 'utf8');
  console.log(`Merged ${language} content saved to: ${outputFilePath}`);
}

// 执行合并
Object.keys(config.parts).forEach(language => {
  mergeContentFiles(language, config.parts[language]);
});

console.log('Build completed!');