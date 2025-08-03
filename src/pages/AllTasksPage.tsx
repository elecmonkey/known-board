import { onMount } from 'solid-js';
import { useApp } from '@/store';
import TaskList from '@/components/TaskList';
import { filterRootVisibleNodes } from '@/utils/filterUtils';

import { setTitle } from "@/utils/title";

export default function AllTasksPage() {
  const { state, setCurrentView } = useApp();

  onMount(() => {
    setTitle("所有任务");
    setCurrentView('all');
  });

  const filteredNodes = () => {
    const { children } = state();
    // 显示所有节点（包括隐藏的任务集，但会有视觉上的区别）
    return children;
  };

  return (
    <div class="max-w-4xl mx-auto">
      <TaskList 
        nodes={filteredNodes()}
        emptyState={{
          icon: '📚',
          title: '暂无任务',
          description: '暂时没有任何任务或任务集'
        }}
      />
    </div>
  );
}