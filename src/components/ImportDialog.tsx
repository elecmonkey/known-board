import { createSignal, Show, For } from 'solid-js';
import { ConflictItem, ImportMode, ConflictResolution } from '@/utils/importConflictHandler';

interface ImportDialogProps {
  isOpen: boolean;
  hasExistingData: boolean;
  conflicts: ConflictItem[];
  onConfirm: (mode: ImportMode, conflictResolution?: ConflictResolution) => void;
  onCancel: () => void;
}

export default function ImportDialog(props: ImportDialogProps) {
  const [importMode, setImportMode] = createSignal<ImportMode>('replace');
  const [conflictResolution, setConflictResolution] = createSignal<ConflictResolution>('overwrite');
  
  const handleConfirm = () => {
    props.onConfirm(
      importMode(),
      props.conflicts.length > 0 ? conflictResolution() : undefined
    );
  };
  
  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-900 mb-4">导入数据</h3>
          
          {/* 导入模式选择 */}
          <Show when={props.hasExistingData}>
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-3">
                检测到现有数据，请选择导入方式：
              </p>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode() === 'replace'}
                    onChange={() => setImportMode('replace')}
                    class="mr-2"
                  />
                  <span class="text-sm">
                    <strong>覆盖</strong> - 完全替换现有数据
                  </span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode() === 'merge'}
                    onChange={() => setImportMode('merge')}
                    class="mr-2"
                  />
                  <span class="text-sm">
                    <strong>合并</strong> - 将新数据追加到现有数据后
                  </span>
                </label>
              </div>
            </div>
          </Show>
          
          {/* 冲突处理选择 */}
          <Show when={props.conflicts.length > 0 && importMode() === 'merge'}>
            <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p class="text-sm text-yellow-800 mb-2">
                ⚠️ 检测到 {props.conflicts.length} 个ID冲突项：
              </p>
              <div class="max-h-32 overflow-y-auto mb-3">
                <For each={props.conflicts}>
                  {(conflict) => (
                    <div class="text-xs text-yellow-700 truncate">
                      • {conflict.type === 'task' ? '任务' : '任务集'}: {conflict.title}
                    </div>
                  )}
                </For>
              </div>
              <p class="text-sm text-yellow-800 mb-2">请选择处理方式：</p>
              <div class="space-y-1">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="conflictResolution"
                    value="overwrite"
                    checked={conflictResolution() === 'overwrite'}
                    onChange={() => setConflictResolution('overwrite')}
                    class="mr-2"
                  />
                  <span class="text-xs">用新数据覆盖冲突项</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="conflictResolution"
                    value="keep_old"
                    checked={conflictResolution() === 'keep_old'}
                    onChange={() => setConflictResolution('keep_old')}
                    class="mr-2"
                  />
                  <span class="text-xs">保留现有数据，跳过冲突项</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="conflictResolution"
                    value="regenerate_id"
                    checked={conflictResolution() === 'regenerate_id'}
                    onChange={() => setConflictResolution('regenerate_id')}
                    class="mr-2"
                  />
                  <span class="text-xs">为冲突项重新生成ID</span>
                </label>
              </div>
            </div>
          </Show>
          
          {/* 按钮 */}
          <div class="flex justify-end space-x-3">
            <button
              onClick={props.onCancel}
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}