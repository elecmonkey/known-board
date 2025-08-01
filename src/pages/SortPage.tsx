import { onMount, For } from 'solid-js';
import { useApp, TreeUtils } from '@/store';
import TaskList from '@/components/TaskList';

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
        <TaskList 
          nodes={rootNodes()}
          emptyState={{
            icon: '📋',
            title: '暂无任务',
            description: '请先在其他页面创建任务或任务集'
          }}
        />
      </div>
    </div>
  );
}