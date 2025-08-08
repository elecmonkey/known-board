import { createEffect, createSignal, Show } from 'solid-js';
import { ImportStepProps } from '@/types/import';
import { AppStateV2 } from '@/types/app-state';
import { processImportData } from '@/utils/importConflictHandler';

interface ProcessingStepProps extends ImportStepProps {
  currentAppState: AppStateV2;
  onConfirm: (finalData: AppStateV2) => void;
}

export default function ProcessingStep(props: ProcessingStepProps) {
  const [status, setStatus] = createSignal<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = createSignal('');
  const [processedData, setProcessedData] = createSignal<AppStateV2 | null>(null);

  createEffect(() => {
    // 只在第一次渲染时处理，避免无限循环
    if (status() === 'processing' && !processedData()) {
      processImport();
    }
  });

  const processImport = async () => {
    try {
      setStatus('processing');
      setMessage('正在处理导入数据...');
      
      const { parsedData, importMode, conflictResolution } = props.state;
      
      if (!parsedData) {
        throw new Error('没有可导入的数据');
      }

      const startTime = Date.now();

      // 处理数据
      const finalData = processImportData(
        props.currentAppState,
        parsedData,
        importMode,
        conflictResolution
      );

      const processingTime = Date.now() - startTime;
      
      // 如果处理时间少于500ms，则补充延迟以提供更好的用户体验
      if (processingTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - processingTime));
      }

      setProcessedData(finalData);
      setStatus('success');
      
      const modeText = importMode === 'replace' ? '覆盖' : '合并';
      const conflictText = props.state.conflicts.length > 0 
        ? `，处理了 ${props.state.conflicts.length} 个冲突项` 
        : '';
      
      setMessage(`数据${modeText}导入成功${conflictText}！`);
      
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '导入处理失败');
    }
  };

  const handleConfirm = () => {
    const data = processedData();
    if (data) {
      props.onConfirm(data);
    }
  };

  const getProgressText = () => {
    const { parsedData, importMode } = props.state;
    if (!parsedData) return '';
    
    const taskCount = parsedData.children.length;
    const modeText = importMode === 'replace' ? '覆盖导入' : '合并导入';
    
    return `${modeText} ${taskCount} 个项目`;
  };

  return (
    <div class="space-y-6">
      {/* 处理状态 */}
      <div class="text-center py-8">
        <Show when={status() === 'processing'}>
          <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div class="text-sm text-gray-600">{message()}</div>
            <div class="text-xs text-gray-500">{getProgressText()}</div>
          </div>
        </Show>
        
        <Show when={status() === 'success'}>
          <div class="flex flex-col items-center space-y-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div class="w-6 h-6 text-green-600">✓</div>
            </div>
            <div class="text-sm text-green-700 font-medium">{message()}</div>
            <div class="text-xs text-gray-500">{getProgressText()}</div>
          </div>
        </Show>
        
        <Show when={status() === 'error'}>
          <div class="flex flex-col items-center space-y-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <div class="w-6 h-6 text-red-600">✕</div>
            </div>
            <div class="text-sm text-red-700 font-medium">{message()}</div>
          </div>
        </Show>
      </div>

      {/* 导入统计信息 */}
      <Show when={status() === 'success' && processedData()}>
        <div class="bg-gray-50 rounded p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">导入详情</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <div>• 导入方式: {props.state.importMode === 'replace' ? '覆盖模式' : '合并模式'}</div>
            <div>• 项目总数: {processedData()?.children.length || 0}</div>
            <Show when={props.state.conflicts.length > 0}>
              <div>• 处理冲突: {props.state.conflicts.length} 项</div>
              <div>• 冲突策略: {
                props.state.conflictResolution === 'overwrite' ? '覆盖旧数据' :
                props.state.conflictResolution === 'keep_old' ? '保留旧数据' :
                '重新生成ID'
              }</div>
            </Show>
          </div>
        </div>
      </Show>

      {/* 底部按钮 */}
      <div class="flex justify-end pt-4 space-x-3">
        <Show when={status() === 'error'}>
          <button
            onClick={props.onPrev}
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            返回修改
          </button>
        </Show>
        
        <Show when={status() === 'success'}>
          <button
            onClick={handleConfirm}
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            完成导入
          </button>
        </Show>
        
        <Show when={status() === 'error'}>
          <button
            onClick={processImport}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            重试
          </button>
        </Show>
      </div>
    </div>
  );
}