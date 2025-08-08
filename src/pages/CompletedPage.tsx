import { onMount } from 'solid-js';
import { useApp } from '@/store';
import TaskList from '@/components/task/TaskList';
import { filterRootVisibleNodes } from '@/utils/filterUtils';

export default function CompletedPage() {
  const { state, setCurrentView, setPageTitle } = useApp();

  onMount(() => {
    setPageTitle("已完成");
    setCurrentView('completed');
  });

  const filteredNodes = () => {
    const { children } = state;
    // 只显示已完成的任务，显示所有非隐藏的任务集
    return filterRootVisibleNodes(children, (node) => {
      if (node.type === 'task') {
        return node.completed === true;
      }
      return true; // 显示所有任务集
    });
  };

  return (
    <div class="max-w-4xl mx-auto">
      <TaskList 
        nodes={filteredNodes()}
        emptyState={{
          icon: '✅',
          title: '暂无已完成任务',
          description: '完成一些任务后，它们将出现在这里'
        }}
      />
    </div>
  );
}