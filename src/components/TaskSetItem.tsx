import { createSignal, For, Show, useContext } from 'solid-js';
import { Key } from '@solid-primitives/keyed';
import { TaskSet, TreeNode, Task, isTask, isTaskSet } from '@/types/tree';
import { useApp, AppContext, TreeUtils } from '@/store';
import { useToast } from '@/components/Toast';
import TaskItem from '@/components/TaskItem';
import AddIcon from '@/components/icons/AddIcon';
import AddItemForm from '@/components/AddItemForm';
import EditIcon from '@/components/icons/EditIcon';
import HideIcon from '@/components/icons/HideIcon';
import ShowIcon from '@/components/icons/ShowIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import Divider from '@/components/Divider';

// 使用Map来存储每个TaskSet的展开状态，避免组件重新渲染时丢失
const taskSetExpandedMap = new Map<string, boolean>();

interface TaskSetItemProps {
  taskSet: TaskSet;
  depth?: number;
}

export default function TaskSetItem(props: TaskSetItemProps) {
  // 在组件挂载时从Map中恢复展开状态，默认为true
  const [isExpanded, setIsExpanded] = createSignal(taskSetExpandedMap.get(props.taskSet.id) ?? true);
  const [isEditing, setIsEditing] = createSignal(false);
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal(props.taskSet.title);
  const [editDescription, setEditDescription] = createSignal(props.taskSet.description || '');
  
  // 更新Map中的状态
  const updateIsExpanded = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(isExpanded()) : value;
    setIsExpanded(newValue);
    taskSetExpandedMap.set(props.taskSet.id, newValue);
  };
  
  const { state, updateNode, deleteNode, addChildNode, toggleTaskSetHidden, currentView } = useApp();
  const { showUndoToast } = useToast();
  const depth = props.depth || 0;
  
  // 检查是否有隐藏的祖先节点
  const hasHiddenAncestor = () => {
    const currentState = state();
    const parent = TreeUtils.findParent(currentState.children, props.taskSet.id);
    if (!parent) return false;
    
    if (parent.type === 'taskSet' && parent.hidden) return true;
    
    // 递归检查更上级的父节点
    return hasHiddenAncestorRecursive(parent.id);
  };

  const hasHiddenAncestorRecursive = (nodeId: string): boolean => {
    const currentState = state();
    const parent = TreeUtils.findParent(currentState.children, nodeId);
    if (!parent) return false;
    
    if (parent.type === 'taskSet' && parent.hidden) return true;
    return hasHiddenAncestorRecursive(parent.id);
  };
  
  // 只有当前TaskSet隐藏且没有隐藏的祖先时才应用透明度
  const shouldApplyOpacity = () => {
    return props.taskSet.hidden && currentView() === 'all' && !hasHiddenAncestor();
  };

  const handleSave = () => {
    updateNode(props.taskSet.id, {
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
      deleteNode(props.taskSet.id);
    }
  };

  // 获取当前节点的子节点，并根据视图进行过滤
  const getFilteredChildren = () => {
    const children = props.taskSet.children || [];
    
    return children.filter(child => {
      // TaskSet 过滤逻辑
      if (isTaskSet(child)) {
        // 在待办和已完成页面中，过滤掉隐藏的子TaskSet
        if (currentView() === 'pending' || currentView() === 'completed') {
          return !child.hidden;
        }
        return true; // 在全部页面显示所有TaskSet
      }
      
      // Task 过滤逻辑
      if (isTask(child)) {
        switch (currentView()) {
          case 'pending':
            return !child.completed;
          case 'completed':
            return child.completed === true;
          case 'all':
          default:
            return true;
        }
      }
      
      return true;
    });
  };

  const handleAdd = (type: 'task' | 'taskset', title: string, description?: string, deadline?: string, videoUrl?: string) => {
    if (type === 'task') {
      const newTask = TreeUtils.createTaskNode(crypto.randomUUID(), title, description, deadline, videoUrl);
      addChildNode(props.taskSet.id, newTask);
    } else {
      const newTaskSet = TreeUtils.createTaskSetNode(crypto.randomUUID(), title, description);
      addChildNode(props.taskSet.id, newTaskSet);
    }
    setShowAddForm(false);
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
  };

  return (
    <Show when={!props.taskSet.hidden || currentView() === 'all'}>
      <div style={`margin-left: ${depth * 20}px`}>
        <div class={`py-3 pl-2 ${
          shouldApplyOpacity() ? 'opacity-50' : ''
        }`}>
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1">
            <button
              onClick={() => updateIsExpanded(!isExpanded())}
              class="text-gray-400 hover:text-gray-600 mr-2"
            >
              {isExpanded() ? '📂' : '📁'}
            </button>
            
            {isEditing() ? (
              <div class="flex-1">
                <input
                  type="text"
                  id={`taskset-title-${props.taskSet.id}`}
                  name={`taskset-title-${props.taskSet.id}`}
                  value={editTitle()}
                  onInput={(e) => setEditTitle(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded mb-2"
                  placeholder="任务集标题"
                />
                <textarea
                  id={`taskset-description-${props.taskSet.id}`}
                  name={`taskset-description-${props.taskSet.id}`}
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
        
        {isExpanded() && getFilteredChildren().length > 0 && (
          <div class="mt-2 space-y-0">
            <Divider class="my-1" />
            <Key each={getFilteredChildren()} by={(child) => child.id}>
              {(child, index) => (
                <>
                  {(() => {
                    const childValue = child();
                    if (isTaskSet(childValue)) {
                      return <TaskSetItem taskSet={childValue} depth={depth + 1} />;
                    } else {
                      return <TaskItem task={childValue} depth={depth + 1} />;
                    }
                  })()}
                  <Show when={index() < getFilteredChildren().length - 1}>
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