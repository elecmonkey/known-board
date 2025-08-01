// Vite插件：构建时分析bundle并内联prefetch清单到index.html
import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function prefetchManifest(): Plugin {
  let chunks: { high: string[], medium: string[], low: string[] };
  
  return {
    name: 'prefetch-manifest',
    generateBundle(options, bundle) {
      chunks = {
        high: [] as string[],
        medium: [] as string[],
        low: [] as string[]
      };
      
      // 分析所有chunk
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
          // 排除主入口
          if (fileName.includes('index-')) return;
          
          // 核心页面 - high优先级
          if (/^assets\/(Pending|Completed|All|Sort).*Page-.*\.js$/.test(fileName)) {
            chunks.high.push(fileName);
          }
          // 辅助页面 - medium优先级  
          else if (/^assets\/(About|Guide).*Page-.*\.js$/.test(fileName)) {
            chunks.medium.push(fileName);
          }
          // 其他所有模块 - low优先级
          else {
            chunks.low.push(fileName);
          }
        }
      });
      
      console.log('\n📦 Prefetch chunks:', {
        high: chunks.high.length,
        medium: chunks.medium.length,
        low: chunks.low.length
      });
    },
    
    writeBundle(options, bundle) {
      const outDir = options.dir || 'dist';
      const htmlPath = path.join(outDir, 'index.html');
      
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf-8');
        
        // 在</head>前插入script
        html = html.replace(
          '</head>',
          `  <script>
      window.__PREFETCH_MANIFEST__ = ${JSON.stringify(chunks)};
    </script>
  </head>`
        );
        
        fs.writeFileSync(htmlPath, html);
        console.log('Prefetch manifest injected into index.html');
      }
    }
  };
}