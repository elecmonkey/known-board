import { createSignal, Show } from 'solid-js';
import { AppStateV2 } from '@/types/app-state';
import { exportDataAsJson, exportDataAsCompressed } from '@/utils/importExport';
import { prepareExportData } from '@/utils/versionManager';

interface ExportModalProps {
  isOpen: boolean;
  currentState: AppStateV2;
  onClose: () => void;
}

export default function ExportModal(props: ExportModalProps) {
  const [isExporting, setIsExporting] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [messageType, setMessageType] = createSignal<'success' | 'error' | ''>('');
  const [isLoadingWasm, setIsLoadingWasm] = createSignal(false);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      
      const exportData = prepareExportData(props.currentState);
      const jsonString = JSON.stringify(exportData);
      
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonString);
        showMessage('数据已复制到剪贴板！', 'success');
      } else {
        // 兼容性备用方案
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            showMessage('数据已复制到剪贴板！', 'success');
          } else {
            throw new Error('复制命令执行失败');
          }
        } catch {
          throw new Error('无法复制到剪贴板');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('复制失败:', error);
      showMessage(error instanceof Error ? error.message : '复制失败', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJsonFile = () => {
    try {
      setIsExporting(true);
      
      // 生成文件名
      const now = new Date();
      const dateString = now.getFullYear() + 
        '-' + String(now.getMonth() + 1).padStart(2, '0') + 
        '-' + String(now.getDate()).padStart(2, '0') +
        '-' + String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      const filename = `known-board-export-${dateString}.json`;
      exportDataAsJson(props.currentState, filename);
      showMessage('JSON文件下载已开始！', 'success');
    } catch (error) {
      console.error('下载失败:', error);
      showMessage(error instanceof Error ? error.message : '下载失败', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCompressedFile = async () => {
    try {
      setIsExporting(true);
      setIsLoadingWasm(true);
      
      // 生成文件名
      const now = new Date();
      const dateString = now.getFullYear() + 
        '-' + String(now.getMonth() + 1).padStart(2, '0') + 
        '-' + String(now.getDate()).padStart(2, '0') +
        '-' + String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      
      const filename = `known-board-export-${dateString}.kbz`;
      await exportDataAsCompressed(props.currentState, filename);
      showMessage('压缩文件下载已开始！', 'success');
    } catch (error) {
      console.error('压缩导出失败:', error);
      showMessage(error instanceof Error ? error.message : '压缩导出失败', 'error');
    } finally {
      setIsExporting(false);
      setIsLoadingWasm(false);
    }
  };

  const getDataStats = () => {
    const taskCount = props.currentState.children.length;
    return `包含 ${taskCount} 个项目`;
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">导出数据</h3>
          
          {/* 数据统计 */}
          <div class="mb-6 p-3 bg-gray-50 rounded">
            <div class="text-sm text-gray-600">
              <div class="font-medium mb-1">导出内容</div>
              <div>{getDataStats()}</div>
            </div>
          </div>

          {/* 导出选项 */}
          <div class="space-y-3 mb-6">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting()}
              class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div class="text-sm font-medium">复制到剪贴板</div>
              <div class="text-xs text-gray-500 mt-1">适用于微信等受限环境</div>
            </button>

            <button
              onClick={handleDownloadJsonFile}
              disabled={isExporting()}
              class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div class="text-sm font-medium">下载标准文件</div>
              <div class="text-xs text-gray-500 mt-1">保存为 .json 格式，兼容性最好</div>
            </button>

            <button
              onClick={handleDownloadCompressedFile}
              disabled={isExporting()}
              class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div class="text-sm font-medium">下载压缩文件</div>
              <div class="text-xs text-gray-500 mt-1">保存为 .kbz 格式，文件更小</div>
              <Show when={isLoadingWasm()}>
                <div class="text-xs text-blue-600 mt-1">
                  正在加载压缩模块...
                </div>
              </Show>
            </button>
          </div>

          {/* 消息提示 */}
          <Show when={message()}>
            <div class={`mb-4 p-3 rounded text-sm ${
              messageType() === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message()}
            </div>
          </Show>

          {/* 底部按钮 */}
          <div class="flex justify-start">
            <button
              onClick={props.onClose}
              disabled={isExporting()}
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              {isExporting() ? '处理中...' : '取消'}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}