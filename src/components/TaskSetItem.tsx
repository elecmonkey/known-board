import { createSignal, For, Show } from 'solid-js';
import { TaskSet, Task } from '../types';
import { useApp } from '../store';
import TaskItem from './TaskItem';
import AddIcon from './icons/AddIcon';
import EditIcon from './icons/EditIcon';
import HideIcon from './icons/HideIcon';
import ShowIcon from './icons/ShowIcon';
import DeleteIcon from './icons/DeleteIcon';
import Divider from './Divider';

interface TaskSetItemProps {
  taskSet: TaskSet;
  depth?: number;
}

export default function TaskSetItem(props: TaskSetItemProps) {
  const [isExpanded, setIsExpanded] = createSignal(true);
  const [isEditing, setIsEditing] = createSignal(false);
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [addType, setAddType] = createSignal<'task' | 'taskset'>('task');
  const [editTitle, setEditTitle] = createSignal(props.taskSet.title);
  const [editDescription, setEditDescription] = createSignal(props.taskSet.description || '');
  const [newTitle, setNewTitle] = createSignal('');
  const [newDescription, setNewDescription] = createSignal('');
  
  const { state, updateTaskSet, deleteTaskSet, addTaskToSet, addTaskSetToSet } = useApp();
  const depth = props.depth || 0;

  const handleSave = () => {
    updateTaskSet(props.taskSet.id, {
      title: editTitle(),
      description: editDescription() || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(props.taskSet.title);
    setEditDescription(props.taskSet.description || '');
    setIsEditing(false);
  };

  const toggleHidden = () => {
    updateTaskSet(props.taskSet.id, { hidden: !props.taskSet.hidden });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个任务集吗？')) {
      deleteTaskSet(props.taskSet.id);
    }
  };

  // 获取属于当前任务集的所有任务集
  const childTaskSets = () => {
    return state().taskSets.filter(taskSet => taskSet.parentId === props.taskSet.id);
  };

  // 获取属于当前任务集的所有任务
  const childTasks = () => {
    return state().tasks.filter(task => task.parentId === props.taskSet.id);
  };

  const handleAdd = () => {
    if (!newTitle()) return;

    if (addType() === 'task') {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTitle(),
        description: newDescription() || undefined,
        completed: false,
        episodes: []
      };
      addTaskToSet(props.taskSet.id, newTask);
    } else {
      const newTaskSet: TaskSet = {
        id: crypto.randomUUID(),
        title: newTitle(),
        description: newDescription() || undefined,
        hidden: false
      };
      addTaskSetToSet(props.taskSet.id, newTaskSet);
    }

    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleAddCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div style={`margin-left: ${depth * 20}px`}>
      <div class={`py-3 ${
        props.taskSet.hidden ? 'opacity-50' : ''
      }`}>
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded())}
              class="text-gray-400 hover:text-gray-600 mr-2"
            >
              {isExpanded() ? '📂' : '📁'}
            </button>
            
            {isEditing() ? (
              <div class="flex-1">
                <input
                  type="text"
                  value={editTitle()}
                  onInput={(e) => setEditTitle(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded mb-2"
                  placeholder="任务集标题"
                />
                <textarea
                  value={editDescription()}
                  onInput={(e) => setEditDescription(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded resize-none"
                  rows="2"
                  placeholder="描述（可选）"
                />
              </div>
            ) : (
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{props.taskSet.title}</h3>
                {props.taskSet.description && (
                  <p class="text-sm text-gray-600 mt-1">{props.taskSet.description}</p>
                )}
              </div>
            )}
          </div>
          
          <div class="flex items-center space-x-2">
            {isEditing() ? (
              <>
                <button
                  onClick={handleSave}
                  class="text-green-600 hover:text-green-800 p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  class="text-gray-600 hover:text-gray-800 p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                  }}
                  class="text-blue-600 hover:text-blue-800 p-1"
                  title="添加"
                >
                  <AddIcon />
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  class="text-blue-600 hover:text-blue-800 p-1"
                  title="编辑"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={toggleHidden}
                  class={`p-1 ${props.taskSet.hidden ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'}`}
                  title={props.taskSet.hidden ? '显示' : '隐藏'}
                >
                  {props.taskSet.hidden ? <ShowIcon /> : <HideIcon />}
                </button>
                <button
                  onClick={handleDelete}
                  class="text-red-600 hover:text-red-800 p-1"
                  title="删除"
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        </div>
        
        {showAddForm() && (
          <div class="mt-4 p-4 bg-gray-50">
            <h3 class="text-lg font-medium text-gray-900 mb-3">添加到任务集</h3>
            
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
                  class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={addType() === 'task' ? '任务标题' : '任务集标题'}
                />
              </div>
              
              <div>
                <textarea
                  value={newDescription()}
                  onInput={(e) => setNewDescription(e.target.value)}
                  class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="2"
                  placeholder="描述（可选）"
                />
              </div>
              
              <div class="flex space-x-3">
                <button
                  onClick={handleAdd}
                  class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  添加
                </button>
                <button
                  onClick={handleAddCancel}
                  class="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isExpanded() && (childTaskSets().length > 0 || childTasks().length > 0) && (
          <div class="mt-2 space-y-0">
            <Divider class="my-1" />
            <For each={childTaskSets()}>
              {(childTaskSet, index) => (
                <>
                  <TaskSetItem taskSet={childTaskSet} depth={depth + 1} />
                  <Show when={index() < childTaskSets().length - 1 || childTasks().length > 0}>
                    <Divider class="my-1 mx-4" />
                  </Show>
                </>
              )}
            </For>
            
            <For each={childTasks()}>
              {(task, index) => (
                <>
                  <TaskItem task={task} depth={depth + 1} />
                  <Show when={index() < childTasks().length - 1}>
                    <Divider class="my-1 mx-4" />
                  </Show>
                </>
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
}