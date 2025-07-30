import { createSignal, onMount } from 'solid-js';
import { useApp } from '../store';
import TaskList from '../components/TaskList';
import AddItemForm from '../components/AddItemForm';
import { Task, TaskSet } from '../types';

export default function PendingPage() {
  const { state, addTask, addTaskSet, setCurrentView } = useApp();
  const [showAddForm, setShowAddForm] = createSignal(false);

  onMount(() => {
    setCurrentView('pending');
  });

  const filteredData = () => {
    return {
      tasks: state().tasks.filter(task => !task.completed && !task.parentId),
      taskSets: state().taskSets.filter(ts => !ts.hidden && !ts.parentId)
    };
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
    <div class="max-w-4xl mx-auto py-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">待办任务</h1>
        <button
          onClick={() => setShowAddForm(true)}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          添加项目
        </button>
      </div>

      {showAddForm() && (
        <AddItemForm
          onAdd={handleAdd}
          onCancel={handleCancel}
          title="添加新项目"
        />
      )}

      <TaskList 
        tasks={filteredData().tasks} 
        taskSets={filteredData().taskSets}
        emptyState={{
          icon: '📝',
          title: '暂无待办任务',
          description: '点击上方"添加项目"按钮开始创建任务或任务集'
        }}
      />
    </div>
  );
}