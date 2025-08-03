import { A } from '@solidjs/router';
import { useApp } from '@/store';
import { exportDataAsJson, importDataFromJson } from '@/utils/importExport';
import GithubIcon from '@/components/icons/GithubIcon';

export default function Footer() {
  const { state, importData } = useApp();
  
  const handleExport = () => {
    try {
      // 将时间精确到秒
      const now = new Date();
      const dateString = now.getFullYear() + 
        '-' + String(now.getMonth() + 1).padStart(2, '0') + 
        '-' + String(now.getDate()).padStart(2, '0') +
        '-' + String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      exportDataAsJson(state, `known-board-export-${dateString}.json`);
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
        const migratedData = await importDataFromJson(file);
        importData(migratedData);
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
      <div class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-4xl mx-auto">
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
                  <GithubIcon class="w-4 h-4 mr-1" />
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
      </div>
    </footer>
  );
}