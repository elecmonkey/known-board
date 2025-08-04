import { ImportStepProps } from '@/types/import';

export default function ImportModeStep(props: ImportStepProps) {

  const handleNext = () => {
    props.onNext();
  };

  return (
    <div class="space-y-6">
      <div>
        <p class="text-sm text-gray-600 mb-4">
          检测到现有数据，请选择导入方式：
        </p>
        
        <div class="space-y-3">
          <label class="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="importMode"
              value="replace"
              checked={props.state.importMode === 'replace'}
              onChange={() => props.onStateChange({ importMode: 'replace' })}
              class="mr-3 mt-0.5"
            />
            <div>
              <div class="text-sm font-medium">覆盖模式</div>
              <div class="text-xs text-gray-500 mt-1">
                完全替换现有数据。当前的所有任务和任务集将被删除。
              </div>
            </div>
          </label>
          
          <label class="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="importMode"
              value="merge"
              checked={props.state.importMode === 'merge'}
              onChange={() => props.onStateChange({ importMode: 'merge' })}
              class="mr-3 mt-0.5"
            />
            <div>
              <div class="text-sm font-medium">合并模式</div>
              <div class="text-xs text-gray-500 mt-1">
                将新数据追加到现有数据后。保留当前的任务和任务集。
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* 底部按钮 */}
      <div class="flex justify-between pt-4">
        <button
          onClick={props.onPrev}
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          上一步
        </button>
        
        <div class="space-x-3">
          <button
            onClick={props.onCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
          <button
            onClick={handleNext}
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}