import { onMount } from 'solid-js';
import { useApp } from '@/store';
import { renderTree } from '@/components/sort/SortTreeRenderer';

export default function SortPage() {
  const { state, setCurrentView } = useApp();

  onMount(() => {
    setCurrentView('sort');
  });

  const rootNodes = () => state().children;

  return (
    <div class="max-w-4xl mx-auto py-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">排序（开发中）</h1>
        <p class="text-gray-600">拖拽排序功能正在开发中，目前显示所有项目的层次结构。</p>
      </div>
      
      <div class="space-y-1">
        {rootNodes().length > 0 ? (
          <div>
            {renderTree(rootNodes())}
          </div>
        ) : (
          <div class="text-center py-8">
            <div class="text-4xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
            <p class="text-gray-600">请先在其他页面创建任务或任务集</p>
          </div>
        )}
      </div>
    </div>
  );
}