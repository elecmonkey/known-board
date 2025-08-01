// 收集所有页面组件
const modules = import.meta.glob('@/pages/*Page.tsx');

console.log(modules);

export function preloadAllPages(exceptFile: string = '') {
  for (const path in modules) {
    if (path.includes(exceptFile)) {
      continue;
    }
    
    modules[path]().then(() => {
      console.log(`预加载: ${path}`);
    }).catch((error) => {
      console.warn(`预加载失败: ${path}`, error);
    });
  }
}