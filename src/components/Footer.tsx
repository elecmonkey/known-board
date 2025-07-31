import { A } from '@solidjs/router';
import { useApp } from '../store';
import { exportDataAsJson, importDataFromJson } from '../utils/importExport';

export default function Footer() {
  const { state, importData } = useApp();
  
  const handleExport = () => {
    try {
      const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          tasks: state().tasks,
          taskSets: state().taskSets
        }
      };
      
      // 将时间精确到秒
      const now = new Date();
      const dateString = now.getFullYear() + 
        '-' + String(now.getMonth() + 1).padStart(2, '0') + 
        '-' + String(now.getDate()).padStart(2, '0') +
        '-' + String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      exportDataAsJson(data, `known-board-export-${dateString}.json`);
    } catch (error) {
      console.error('导出失败:', error);
      alert(error instanceof Error ? error.message : '导出失败');
    }
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const parsedData = await importDataFromJson(file);
        
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
        alert(error instanceof Error ? error.message : '导入失败');
      }
    };
    
    input.click();
  };

  return (
    <footer class="bg-white border-t border-gray-200 py-6 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex flex-col items-center md:items-start">
            <div class="text-sm text-gray-500 mb-1">
              © {new Date().getFullYear()} Known Board
            </div>
            <div class="text-xs text-gray-400">
              Made with ❤️ by{' '}
              <a 
                href="https://www.elecmonkey.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Elecmonkey
              </a>
              {' '}using{' '}
              <a 
                href="https://www.solidjs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                SolidJS
              </a>
            </div>
          </div>
          
          <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div class="flex items-center space-x-4">
              <button 
                onClick={handleExport}
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                导出
              </button>
              <button 
                onClick={handleImport}
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                导入
              </button>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-gray-300 hidden md:inline">|</span>
              <a 
                href="https://github.com/elecmonkey/known-board" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                </svg>
                <span>GitHub</span>
              </a>
              <A 
                href="/guide" 
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                指南
              </A>
              <A 
                href="/about" 
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                关于
              </A>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}