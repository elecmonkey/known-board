import { onMount } from 'solid-js';
import { useApp } from '@/store';
import TaskList from '@/components/TaskList';
import { filterVisibleItems } from '@/utils/filterUtils';

export default function CompletedPage() {
  const { state, setCurrentView } = useApp();

  onMount(() => {
    setCurrentView('completed');
  });

  const filteredData = () => {
    const { tasks, taskSets } = state();
    return filterVisibleItems(tasks, taskSets, task => task.completed);
  };

  return (
    <div class="max-w-4xl mx-auto">
      <TaskList 
        tasks={filteredData().tasks} 
        taskSets={filteredData().taskSets}
        emptyState={{
          icon: '✅',
          title: '暂无已完成任务',
          description: '您还没有完成任何任务'
        }}
      />
    </div>
  );
}