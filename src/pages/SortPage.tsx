import { onMount, For } from 'solid-js';
import { useApp } from '@/store';
import { renderTree } from '@/components/sort/SortTreeRenderer';

export default function SortPage() {
  const { state, setCurrentView } = useApp();

  onMount(() => {
    setCurrentView('sort');
  });

  const rootTaskSets = () => state().taskSets.filter(ts => !ts.parentId);
  const rootTasks = () => state().tasks.filter(t => !t.parentId);

  return (
    <div class="max-w-4xl mx-auto py-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">排序（开发中）</h1>
        <p class="text-gray-600">拖拽右侧的手柄图标来调整任务和任务集的顺序。</p>
      </div>
      
      <div class="space-y-1">
        <For each={renderTree(rootTaskSets(), rootTasks(), state().taskSets, state().tasks)}>
          {(item) => item}
        </For>
        
        {rootTaskSets().length === 0 && rootTasks().length === 0 && (
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
            <p class="text-gray-500">请先在其他页面创建任务或任务集</p>
          </div>
        )}
      </div>
    </div>
  );
}