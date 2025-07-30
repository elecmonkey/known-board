import { For, createSignal } from 'solid-js';
import { useApp } from '../store';
import TaskSetItem from '../components/TaskSetItem';
import TaskItem from '../components/TaskItem';
import { Task, TaskSet } from '../types';

export default function CompletedPage() {
  const { state, addTask, addTaskSet } = useApp();
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [addType, setAddType] = createSignal<'task' | 'taskset'>('task');
  const [newTitle, setNewTitle] = createSignal('');
  const [newDescription, setNewDescription] = createSignal('');

  const filteredData = () => {
    return {
      tasks: state().tasks.filter(task => task.completed && !task.parentId),
      taskSets: state().taskSets.filter(ts => !ts.hidden && !ts.parentId)
    };
  };

  const handleAdd = () => {
    if (!newTitle().trim()) return;

    if (addType() === 'task') {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTitle(),
        description: newDescription() || undefined,
        completed: false,
        episodes: []
      };
      addTask(newTask);
    } else {
      const newTaskSet: TaskSet = {
        id: crypto.randomUUID(),
        title: newTitle(),
        description: newDescription() || undefined,
        hidden: false
      };
      addTaskSet(newTaskSet);
    }

    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div class="max-w-4xl mx-auto py-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">已完成任务</h1>
        <button
          onClick={() => setShowAddForm(true)}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          添加项目
        </button>
      </div>

      {showAddForm() && (
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">添加新项目</h3>
          
          <div class="space-y-4">
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={addType() === 'task'}
                  onChange={() => setAddType('task')}
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                任务
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={addType() === 'taskset'}
                  onChange={() => setAddType('taskset')}
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                任务集
              </label>
            </div>
            
            <div>
              <input
                type="text"
                value={newTitle()}
                onInput={(e) => setNewTitle(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={addType() === 'task' ? '任务标题' : '任务集标题'}
              />
            </div>
            
            <div>
              <textarea
                value={newDescription()}
                onInput={(e) => setNewDescription(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
                placeholder="描述（可选）"
              />
            </div>
            
            <div class="flex space-x-3">
              <button
                onClick={handleAdd}
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                添加
              </button>
              <button
                onClick={handleCancel}
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <For each={filteredData().taskSets}>
          {(taskSet) => <TaskSetItem taskSet={taskSet} />}
        </For>
        
        <For each={filteredData().tasks}>
          {(task) => <TaskItem task={task} />}
        </For>
        
        {filteredData().tasks.length === 0 && filteredData().taskSets.length === 0 && (
          <div class="text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">✅</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无已完成任务</h3>
            <p class="text-gray-500">您还没有完成任何任务</p>
          </div>
        )}
      </div>
    </div>
  );
}
