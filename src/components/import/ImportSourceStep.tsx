import { createSignal, Show, createMemo } from 'solid-js';
import { ImportStepProps } from '@/types/import';
import { importDataFromJson } from '@/utils/importExport';
import { AppStateV2 } from '@/types/app-state';
import { loadAppData } from '@/utils/versionManager';

export default function ImportSourceStep(props: ImportStepProps) {
  const [pasteContent, setPasteContent] = createSignal('');
  const [isDragOver, setIsDragOver] = createSignal(false);

  // 创建响应式的importSource
  const importSource = createMemo(() => props.state.importSource);

  const parseJsonContent = async (content: string): Promise<AppStateV2> => {
    try {
      const parsedData = JSON.parse(content);
      
      // 处理完整的导出格式（包含 version, exportedAt, data）
      let dataToMigrate = parsedData;
      if (parsedData.data) {
        dataToMigrate = parsedData.data;
      }
      
      // 使用版本管理器处理数据迁移，支持v1和v2版本
      const migratedData = loadAppData(dataToMigrate);
      return migratedData;
    } catch (error) {
      throw new Error('JSON格式无效: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      props.onStateChange({ error: null, isProcessing: true });
      
      const rawContent = await file.text();
      
      // 先用我们自己的校验逻辑
      const parsedData = await parseJsonContent(rawContent);
      
      props.onStateChange({
        rawData: rawContent,
        parsedData: parsedData,
        isProcessing: false
      });
      
      // 校验通过自动下一步
      props.onNext();
    } catch (error) {
      props.onStateChange({
        error: error instanceof Error ? error.message : '文件处理失败',
        isProcessing: false
      });
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    
    input.click();
  };

  const handlePasteSubmit = async () => {
    const content = pasteContent().trim();
    if (!content) {
      props.onStateChange({ error: '请输入内容' });
      return;
    }

    try {
      props.onStateChange({ error: null, isProcessing: true });
      
      const parsedData = await parseJsonContent(content);
      
      props.onStateChange({
        rawData: content,
        parsedData: parsedData,
        isProcessing: false
      });
      
      props.onNext();
    } catch (error) {
      props.onStateChange({
        error: error instanceof Error ? error.message : '内容处理失败',
        isProcessing: false
      });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        await handleFileUpload(file);
      } else {
        props.onStateChange({ error: '请选择JSON文件' });
      }
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <p class="text-sm text-gray-600 mb-4">请选择导入方式：</p>
        
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              type="radio"
              name="importSource"
              value="file"
              checked={importSource() === 'file'}
              onChange={() => {
                console.log('Switching to file mode');
                props.onStateChange({ 
                  importSource: 'file',
                  error: null // 清空错误信息
                });
              }}
              class="mr-3"
            />
            <span class="text-sm font-medium">上传文件</span>
          </label>
          
          <label class="flex items-center">
            <input
              type="radio"
              name="importSource"
              value="paste"
              checked={importSource() === 'paste'}
              onChange={() => {
                console.log('Switching to paste mode');
                props.onStateChange({ 
                  importSource: 'paste',
                  error: null // 清空错误信息
                });
              }}
              class="mr-3"
            />
            <span class="text-sm font-medium">粘贴内容</span>
          </label>
        </div>
      </div>

      <div class="mt-6">
        <Show when={importSource() === 'file'}>
          <div class="space-y-3">
            <div
              class={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver() 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div class="space-y-2">
                <div class="text-gray-500 text-sm">
                  拖拽JSON文件到此处，或者
                </div>
                <button
                  onClick={handleFileSelect}
                  disabled={props.state.isProcessing}
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {props.state.isProcessing ? '处理中...' : '选择文件'}
                </button>
              </div>
            </div>
          </div>
        </Show>

        <Show when={importSource() === 'paste'}>
          <div class="space-y-3">
            <textarea
              value={pasteContent()}
              onInput={(e) => setPasteContent(e.target.value)}
              placeholder="请粘贴导出的JSON内容..."
              class="w-full h-32 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="flex justify-end">
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteContent().trim() || props.state.isProcessing}
                class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {props.state.isProcessing ? '处理中...' : '解析内容'}
              </button>
            </div>
          </div>
        </Show>
      </div>

      {/* 错误提示 */}
      <Show when={props.state.error}>
        <div class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {props.state.error}
        </div>
      </Show>

      {/* 底部按钮 */}
      <div class="flex justify-between pt-4">
        <button
          onClick={props.onCancel}
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          取消
        </button>
      </div>
    </div>
  );
}