import { A } from '@solidjs/router';
import { useApp } from '../store';

export default function Footer() {
  const { state, importData } = useApp();
  
  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        tasks: state().tasks,
        taskSets: state().taskSets
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `known-board-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.onerror = (e) => {
            reject(new Error('读取文件失败'));
          };
          reader.readAsText(file);
        });

        const parsedData = JSON.parse(content);
        
        if (!parsedData.version || !parsedData.data) {
          alert('无效的文件格式');
          return;
        }
        
        // 验证数据结构
        if (!Array.isArray(parsedData.data.tasks) || !Array.isArray(parsedData.data.taskSets)) {
          alert('数据格式不正确');
          return;
        }
        
        importData(parsedData.data);
        alert('数据导入成功！');
      } catch (error) {
        console.error('导入失败:', error);
        alert('文件解析失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
    };
    
    input.click();
  };

  return (
    <footer class="bg-white border-t border-gray-200 py-4 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500">
            © {new Date().getFullYear()} Known Board. All rights reserved.
          </div>
          <div class="flex items-center space-x-4 mt-2 md:mt-0">
            <button 
              onClick={handleExport}
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              导出
            </button>
            <button 
              onClick={handleImport}
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              导入
            </button>
            <span class="text-gray-300">|</span>
            <span class="text-sm text-gray-500">Author: Your Name</span>
            <A 
              href="/about" 
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              关于
            </A>
          </div>
        </div>
      </div>
    </footer>
  );
}