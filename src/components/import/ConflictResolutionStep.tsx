import { For } from 'solid-js';
import { ImportStepProps } from '@/types/import';

export default function ConflictResolutionStep(props: ImportStepProps) {
  return (
    <div class="space-y-6">
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div class="flex items-center mb-2">
          <div class="text-yellow-600 mr-2">⚠️</div>
          <h4 class="text-sm font-medium text-yellow-800">
            检测到 {props.state.conflicts.length} 个ID冲突项
          </h4>
        </div>
        
        <div class="max-h-32 overflow-y-auto mb-4">
          <For each={props.state.conflicts}>
            {(conflict) => (
              <div class="text-xs text-yellow-700 py-1 border-b border-yellow-200 last:border-b-0">
                <span class="font-medium">
                  {conflict.type === 'task' ? '📝 任务' : '📁 任务集'}:
                </span>
                <span class="ml-2">{conflict.title}</span>
                <span class="text-yellow-600 ml-2">({conflict.id.slice(0, 8)}...)</span>
              </div>
            )}
          </For>
        </div>
        
        <p class="text-sm text-yellow-800">
          这些项目的ID与现有数据重复，可能来自相同设备的先前导出。请选择处理方式：
        </p>
      </div>

      <div class="space-y-3">
        <label class="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="conflictResolution"
            value="overwrite"
            checked={props.state.conflictResolution === 'overwrite'}
            onChange={() => props.onStateChange({ conflictResolution: 'overwrite' })}
            class="mr-3 mt-0.5"
          />
          <div>
            <div class="text-sm font-medium">用新数据覆盖</div>
            <div class="text-xs text-gray-500 mt-1">
              删除现有的冲突项，使用导入的新数据替换。
            </div>
          </div>
        </label>
        
        <label class="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="conflictResolution"
            value="keep_old"
            checked={props.state.conflictResolution === 'keep_old'}
            onChange={() => props.onStateChange({ conflictResolution: 'keep_old' })}
            class="mr-3 mt-0.5"
          />
          <div>
            <div class="text-sm font-medium">保留现有数据</div>
            <div class="text-xs text-gray-500 mt-1">
              跳过导入冲突的项目，保留当前数据不变。
            </div>
          </div>
        </label>
        
        <label class="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="conflictResolution"
            value="regenerate_id"
            checked={props.state.conflictResolution === 'regenerate_id'}
            onChange={() => props.onStateChange({ conflictResolution: 'regenerate_id' })}
            class="mr-3 mt-0.5"
          />
          <div>
            <div class="text-sm font-medium">重新生成ID</div>
            <div class="text-xs text-gray-500 mt-1">
              为冲突的项目生成新的唯一ID，保留两份数据。
            </div>
          </div>
        </label>
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
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={props.onNext}
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            开始导入
          </button>
        </div>
      </div>
    </div>
  );
}