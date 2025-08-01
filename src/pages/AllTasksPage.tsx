import { onMount } from 'solid-js';
import { useApp } from '@/store';
import TaskList from '@/components/TaskList';

export default function AllTasksPage() {
  const { state, setCurrentView } = useApp();

  onMount(() => {
    setCurrentView('all');
  });

  const filteredData = () => {
    return {
      tasks: state().tasks.filter(task => !task.parentId),
      taskSets: state().taskSets.filter(ts => !ts.parentId)
    };
  };

  return (
    <div class="max-w-4xl mx-auto">
      <TaskList 
        tasks={filteredData().tasks} 
        taskSets={filteredData().taskSets}
        emptyState={{
          icon: '📚',
          title: '暂无任务',
          description: '暂时没有任何任务或任务集'
        }}
      />
    </div>
  );
}