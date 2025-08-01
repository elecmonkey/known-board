import { createSignal, For, Show, useContext } from 'solid-js';
import { Key } from '@solid-primitives/keyed';
import { TaskSet, Task } from '@/types';
import { useApp, AppContext } from '@/store';
import { useToast } from '@/components/Toast';
import TaskItem from '@/components/TaskItem';
import AddIcon from '@/components/icons/AddIcon';
import AddItemForm from '@/components/AddItemForm';
import EditIcon from '@/components/icons/EditIcon';
import HideIcon from '@/components/icons/HideIcon';
import ShowIcon from '@/components/icons/ShowIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import Divider from '@/components/Divider';

interface TaskSetItemProps {
  taskSet: TaskSet;
  depth?: number;
}

export default function TaskSetItem(props: TaskSetItemProps) {
  const [isExpanded, setIsExpanded] = createSignal(true);
  const [isEditing, setIsEditing] = createSignal(false);
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal(props.taskSet.title);
  const [editDescription, setEditDescription] = createSignal(props.taskSet.description || '');
  
  const { state, updateTaskSet, deleteTaskSet, addTaskToSet, addTaskSetToSet, toggleTaskSetHidden, currentView } = useApp();
  const { showUndoToast } = useToast();
  const depth = props.depth || 0;
  
  // 检查是否有隐藏的祖先节点
  const hasHiddenAncestor = () => {
    if (!props.taskSet.parentId) return false;
    
    const findParentTaskSet = (id: string): TaskSet | undefined => {
      return state().taskSets.find(ts => ts.id === id);
    };
    
    let currentParentId = props.taskSet.parentId;
    while (currentParentId) {
      const parent = findParentTaskSet(currentParentId);
      if (parent?.hidden) return true;
      currentParentId = parent?.parentId;
    }
    return false;
  };
  
  // 只有当前TaskSet隐藏且没有隐藏的祖先时才应用透明度
  const shouldApplyOpacity = () => {
    return props.taskSet.hidden && currentView() === 'all' && !hasHiddenAncestor();
  };

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
    toggleTaskSetHidden(props.taskSet.id, showUndoToast);
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个任务集吗？')) {
      deleteTaskSet(props.taskSet.id);
    }
  };

  // 获取属于当前任务集的所有任务集
  const childTaskSets = () => {
    const childSets = state().taskSets.filter(taskSet => taskSet.parentId === props.taskSet.id);
    
    // 在待办和已完成页面中，过滤掉隐藏的子TaskSet
    if (currentView() === 'pending' || currentView() === 'completed') {
      return childSets.filter(taskSet => !taskSet.hidden);
    }
    
    return childSets;
  };

  // 获取属于当前任务集的所有任务，并根据当前视图进行过滤
  const childTasks = () => {
    const tasks = state().tasks.filter(task => task.parentId === props.taskSet.id);
    
    switch (currentView()) {
      case 'pending':
        // 待办页面只显示未完成的任务
        return tasks.filter(task => !task.completed);
      case 'completed':
        // 已完成页面只显示已完成的任务
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        // 所有任务页面显示所有任务
        return tasks;
    }
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
      addTaskToSet(props.taskSet.id, newTask);
    } else {
      const newTaskSet: TaskSet = {
        id: crypto.randomUUID(),
        title,
        description,
        hidden: false
      };
      addTaskSetToSet(props.taskSet.id, newTaskSet);
    }
    setShowAddForm(false);
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
  };

  return (
    <Show when={!props.taskSet.hidden || currentView() === 'all'}>
      <div style={`margin-left: ${depth * 20}px`}>
        <div class={`py-3 ${
          shouldApplyOpacity() ? 'opacity-50' : ''
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
          <AddItemForm
            onAdd={handleAdd}
            onCancel={handleAddCancel}
            title="添加到任务集"
          />
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
            
            <Key each={childTasks()} by={(task) => task.id}>
              {(task, index) => (
                <>
                  <TaskItem task={task()} depth={depth + 1} />
                  <Show when={index() < childTasks().length - 1}>
                    <Divider class="my-1 mx-4" />
                  </Show>
                </>
              )}
            </Key>
          </div>
        )}
      </div>
    </div>
    </Show>
  );
}