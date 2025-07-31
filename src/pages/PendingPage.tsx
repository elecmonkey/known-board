import { createSignal, onMount } from 'solid-js';
import { useApp } from '../store';
import TaskList from '../components/TaskList';
import AddItemForm from '../components/AddItemForm';
import { Task, TaskSet } from '../types';
import { filterVisibleItems } from '../utils/filterUtils';
import PlusIcon from '../components/icons/PlusIcon';

export default function PendingPage() {
  const { state, addTask, addTaskSet, setCurrentView } = useApp();
  const [showAddForm, setShowAddForm] = createSignal(false);

  onMount(() => {
    setCurrentView('pending');
  });

  const filteredData = () => {
    const { tasks, taskSets } = state();
    return filterVisibleItems(tasks, taskSets, task => !task.completed);
  };

  const handleAdd = (type: 'task' | 'taskset', title: string, description?: string) => {
    if (type === 'task') {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        episodes: []
      };
      addTask(newTask);
    } else {
      const newTaskSet: TaskSet = {
        id: crypto.randomUUID(),
        title,
        description,
        hidden: false
      };
      addTaskSet(newTaskSet);
    }
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div class="max-w-4xl mx-auto">
      <TaskList 
        tasks={filteredData().tasks} 
        taskSets={filteredData().taskSets}
        emptyState={{
          icon: '📝',
          title: '暂无待办任务',
          description: '点击下方按钮开始创建任务或任务集'
        }}
      />
      
      {showAddForm() && (
        <AddItemForm
          onAdd={handleAdd}
          onCancel={handleCancel}
          title="添加新项目"
        />
      )}
      
      <div class="flex justify-center mt-6">
        <button
          onClick={() => setShowAddForm(true)}
          class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="添加项目"
        >
          <PlusIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
