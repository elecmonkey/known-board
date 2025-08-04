import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { useApp } from '@/store';
import ImportWizard from '@/components/import/ImportWizard';
import ExportModal from '@/components/export/ExportModal';
import GithubIcon from '@/components/icons/GithubIcon';

export default function Footer() {
  const { state, importData } = useApp();
  const [showImportWizard, setShowImportWizard] = createSignal(false);
  const [showExportModal, setShowExportModal] = createSignal(false);
  
  const handleExport = () => {
    setShowExportModal(true);
  };
  
  const handleImport = () => {
    setShowImportWizard(true);
  };
  
  const handleImportConfirm = (finalData) => {
    importData(finalData);
    setShowImportWizard(false);
  };
  
  const handleImportCancel = () => {
    setShowImportWizard(false);
  };

  const handleExportClose = () => {
    setShowExportModal(false);
  };

  return (
    <>
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
                  <A 
                    href="/"
                    class="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    主页
                  </A>
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
      
      <ImportWizard
        isOpen={showImportWizard()}
        currentState={state}
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
      />
      
      <ExportModal
        isOpen={showExportModal()}
        currentState={state}
        onClose={handleExportClose}
      />
    </>
  );
}