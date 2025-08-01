import { createSignal, createContext, useContext, JSX, createEffect } from 'solid-js';
import { AppStateV2, TreeNode, ViewType, Episode } from '@/types';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

const initialState: AppStateV2 = loadFromStorage();

// 树形数据操作工具函数
export class TreeUtils {
  /**
   * 在树中查找节点
   */
  static findNode(children: TreeNode[], id: string): TreeNode | null {
    for (const node of children) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 在树中查找节点的父节点
   */
  static findParent(children: TreeNode[], targetId: string): TreeNode | null {
    for (const node of children) {
      if (node.children) {
        if (node.children.some(child => child.id === targetId)) {
          return node;
        }
        const found = this.findParent(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 递归遍历所有节点
   */
  static traverse(children: TreeNode[], callback: (node: TreeNode) => void): void {
    children.forEach(node => {
      callback(node);
      if (node.children) {
        this.traverse(node.children, callback);
      }
    });
  }

  /**
   * 过滤节点（保持树形结构）
   */
  static filter(children: TreeNode[], predicate: (node: TreeNode) => boolean): TreeNode[] {
    return children.reduce((acc: TreeNode[], node) => {
      const childrenFiltered = node.children ? this.filter(node.children, predicate) : [];
      if (predicate(node) && childrenFiltered.length > 0) {
        acc.push({ ...node, children: childrenFiltered });
      } else if (predicate(node)) {
        acc.push({ ...node, children: [] });
      } else if (childrenFiltered.length > 0) {
        acc.push({ ...node, children: childrenFiltered });
      }
      return acc;
    }, []);
  }

  /**
   * 创建新的任务节点
   */
  static createTaskNode(id: string, title: string, description?: string): TreeNode {
    return {
      id,
      type: 'task',
      title,
      description,
      completed: false,
      episodes: []
    };
  }

  /**
   * 创建新的任务集节点
   */
  static createTaskSetNode(id: string, title: string, description?: string): TreeNode {
    return {
      id,
      type: 'taskSet',
      title,
      description,
      hidden: false,
      children: []
    };
  }
}

export const AppContext = createContext<{
  state: () => AppStateV2;
  setState: (newState: AppStateV2) => void;
  currentView: () => ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // 树形节点操作
  addRootNode: (node: TreeNode) => void;
  addChildNode: (parentId: string, node: TreeNode) => void;
  updateNode: (id: string, updates: Partial<TreeNode>) => void;
  deleteNode: (id: string) => void;
  moveNode: (nodeId: string, newParentId?: string, newIndex?: number) => void;
  
  // 便捷方法
  addTask: (title: string, description?: string) => void;
  addTaskSet: (title: string, description?: string) => void;
  addTaskToSet: (parentId: string, title: string, description?: string) => void;
  addTaskSetToSet: (parentId: string, title: string, description?: string) => void;
  
  // 兼容旧API的方法 (将在后续版本中废弃)
  updateTask: (id: string, updates: Partial<TreeNode>) => void;
  updateTaskSet: (id: string, updates: Partial<TreeNode>) => void;
  deleteTask: (id: string) => void;
  deleteTaskSet: (id: string) => void;
  
  // 特殊操作
  toggleTaskCompletion: (id: string, showToast?: (message: string, onUndo: () => void) => void) => void;
  toggleTaskSetHidden: (id: string, showToast?: (message: string, onUndo: () => void) => void) => void;
  batchRenameEpisodes: (taskId: string, names: string[], showToast?: (message: string, onUndo: () => void) => void) => void;
  
  // 数据操作
  importData: (data: AppStateV2) => void;
}>();

export function AppProvider(props: { children: JSX.Element }) {
  const [state, setState] = createSignal<AppStateV2>(initialState);
  const [currentView, setCurrentView] = createSignal<ViewType>('pending');

  // 自动保存到localStorage
  createEffect(() => {
    saveToStorage(state());
  });

  // 深拷贝状态的工具函数
  const cloneState = (): AppStateV2 => JSON.parse(JSON.stringify(state()));

  const addRootNode = (node: TreeNode) => {
    setState(prev => ({
      ...prev,
      children: [...prev.children, node]
    }));
  };

  const addChildNode = (parentId: string, node: TreeNode) => {
    setState(prev => {
      const newState = cloneState();
      const parent = TreeUtils.findNode(newState.children, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
      return newState;
    });
  };

  const updateNode = (id: string, updates: Partial<TreeNode>) => {
    setState(prev => {
      const newState = cloneState();
      const node = TreeUtils.findNode(newState.children, id);
      if (node) {
        Object.assign(node, updates);
      }
      return newState;
    });
  };

  const deleteNode = (id: string) => {
    setState(prev => {
      const newState = cloneState();
      
      // 从根级别删除
      newState.children = newState.children.filter(node => node.id !== id);
      
      // 从所有父节点的children中删除
      const removeFromChildren = (children: TreeNode[]) => {
        for (const node of children) {
          if (node.children) {
            node.children = node.children.filter(child => child.id !== id);
            removeFromChildren(node.children);
          }
        }
      };
      
      removeFromChildren(newState.children);
      return newState;
    });
  };

  const moveNode = (nodeId: string, newParentId?: string, newIndex?: number) => {
    setState(prev => {
      const newState = cloneState();
      
      // 找到要移动的节点
      const nodeToMove = TreeUtils.findNode(newState.children, nodeId);
      if (!nodeToMove) {
        console.warn('moveNode: 找不到要移动的节点', nodeId);
        return prev;
      }
      
      // 验证移动目标是否有效
      if (newParentId) {
        const newParent = TreeUtils.findNode(newState.children, newParentId);
        if (!newParent) {
          console.warn('moveNode: 找不到目标父节点', newParentId);
          return prev; // 如果找不到目标父节点，不执行移动
        }
        if (newParent.type !== 'taskSet') {
          console.warn('moveNode: 目标父节点不是taskSet', newParentId);
          return prev; // 只有taskSet才能作为父节点
        }
      }
      
      // 防止将节点移动到自己的子节点中（避免循环引用）
      if (newParentId && nodeToMove.type === 'taskSet') {
        const isDescendant = (parentNode: TreeNode, targetId: string): boolean => {
          if (parentNode.id === targetId) return true;
          if (parentNode.children) {
            return parentNode.children.some(child => isDescendant(child, targetId));
          }
          return false;
        };
        
        if (isDescendant(nodeToMove, newParentId)) {
          console.warn('moveNode: 不能将节点移动到自己的子节点中');
          return prev;
        }
      }
      
      // 从原位置删除
      newState.children = newState.children.filter(node => node.id !== nodeId);
      
      const removeFromChildren = (children: TreeNode[]) => {
        for (const node of children) {
          if (node.children) {
            node.children = node.children.filter(child => child.id !== nodeId);
            removeFromChildren(node.children);
          }
        }
      };
      removeFromChildren(newState.children);
      
      // 添加到新位置
      if (newParentId) {
        const newParent = TreeUtils.findNode(newState.children, newParentId);
        if (newParent) {
          if (!newParent.children) newParent.children = [];
          if (newIndex !== undefined && newIndex >= 0 && newIndex <= newParent.children.length) {
            newParent.children.splice(newIndex, 0, nodeToMove);
          } else {
            newParent.children.push(nodeToMove);
          }
          console.log('moveNode: 移动到父节点', newParentId, '位置', newIndex);
        }
      } else {
        // 移动到根级别
        if (newIndex !== undefined && newIndex >= 0 && newIndex <= newState.children.length) {
          newState.children.splice(newIndex, 0, nodeToMove);
        } else {
          newState.children.push(nodeToMove);
        }
        console.log('moveNode: 移动到根级别，位置', newIndex);
      }
      
      return newState;
    });
  };

  // 便捷方法
  const addTask = (title: string, description?: string) => {
    const newTask = TreeUtils.createTaskNode(crypto.randomUUID(), title, description);
    addRootNode(newTask);
  };

  const addTaskSet = (title: string, description?: string) => {
    const newTaskSet = TreeUtils.createTaskSetNode(crypto.randomUUID(), title, description);
    addRootNode(newTaskSet);
  };

  const addTaskToSet = (parentId: string, title: string, description?: string) => {
    const newTask = TreeUtils.createTaskNode(crypto.randomUUID(), title, description);
    addChildNode(parentId, newTask);
  };

  const addTaskSetToSet = (parentId: string, title: string, description?: string) => {
    const newTaskSet = TreeUtils.createTaskSetNode(crypto.randomUUID(), title, description);
    addChildNode(parentId, newTaskSet);
  };

  const toggleTaskCompletion = (id: string, showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const task = TreeUtils.findNode(currentState.children, id);
    
    if (!task || task.type !== 'task') return;
    
    const previousCompleted = task.completed || false;
    const newCompleted = !previousCompleted;
    
    // 立即更新任务状态
    updateNode(id, { completed: newCompleted });
    
    // 显示撤销提示
    if (showToast) {
      const message = newCompleted 
        ? `已完成「${task.title}」` 
        : `已移至待办「${task.title}」`;
        
      showToast(message, () => {
        // 撤销操作：恢复之前的完成状态
        updateNode(id, { completed: previousCompleted });
      });
    }
  };

  const toggleTaskSetHidden = (id: string, showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const taskSet = TreeUtils.findNode(currentState.children, id);
    
    if (!taskSet || taskSet.type !== 'taskSet') return;
    
    const previousHidden = taskSet.hidden || false;
    const newHidden = !previousHidden;
    
    // 立即更新TaskSet隐藏状态
    updateNode(id, { hidden: newHidden });
    
    // 显示撤销提示
    if (showToast) {
      const message = newHidden 
        ? `已隐藏「${taskSet.title}」` 
        : `已显示「${taskSet.title}」`;
        
      showToast(message, () => {
        // 撤销操作：恢复之前的隐藏状态
        updateNode(id, { hidden: previousHidden });
      });
    }
  };

  const batchRenameEpisodes = (taskId: string, names: string[], showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const task = TreeUtils.findNode(currentState.children, taskId);
    
    if (!task || task.type !== 'task' || !task.episodes?.length) return;
    
    // 保存原始的分集标题用于撤销
    const originalEpisodes = task.episodes.map(ep => ({ ...ep }));
    
    // 创建新的分集数组，只更新有对应名称的分集
    const updatedEpisodes = task.episodes.map((episode, index) => {
      if (index < names.length && names[index]) {
        return { ...episode, title: names[index] };
      }
      return episode;
    });
    
    // 更新任务的分集
    updateNode(taskId, { episodes: updatedEpisodes });
    
    // 显示撤销提示
    if (showToast) {
      const renamedCount = Math.min(names.length, task.episodes.length);
      const message = `已批量重命名 ${renamedCount} 个分集`;
      
      showToast(message, () => {
        // 撤销操作：恢复原始的分集标题
        updateNode(taskId, { episodes: originalEpisodes });
      });
    }
  };

  const importData = (data: AppStateV2) => {
    // 验证数据结构
    if (!data || data.version !== '2.0' || !Array.isArray(data.children)) {
      console.error('Invalid data format for import');
      return;
    }
    
    setState(data);
    // 由于createEffect会自动触发保存，这里不需要手动调用saveToStorage
  };

  // 兼容旧API的方法 (将在后续版本中废弃)
  const updateTask = updateNode;
  const updateTaskSet = updateNode;
  const deleteTask = deleteNode;
  const deleteTaskSet = deleteNode;

  return (
    <AppContext.Provider 
      value={{
        state,
        setState,
        currentView,
        setCurrentView,
        addRootNode,
        addChildNode,
        updateNode,
        deleteNode,
        moveNode,
        addTask,
        addTaskSet,
        addTaskToSet,
        addTaskSetToSet,
        updateTask,
        updateTaskSet,
        deleteTask,
        deleteTaskSet,
        toggleTaskCompletion,
        toggleTaskSetHidden,
        batchRenameEpisodes,
        importData
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}