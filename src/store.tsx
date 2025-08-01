import { createSignal, createContext, useContext, JSX, createEffect } from 'solid-js';
import { AppState, Task, TaskSet, ViewType } from '@/types';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

const initialState: AppState = loadFromStorage();

export const AppContext = createContext<{
  state: () => AppState;
  setState: (newState: AppState) => void;
  currentView: () => ViewType;
  setCurrentView: (view: ViewType) => void;
  addTask: (task: Task) => void;
  addTaskSet: (taskSet: TaskSet) => void;
  addTaskToSet: (taskSetId: string, task: Task) => void;
  addTaskSetToSet: (parentTaskSetId: string, taskSet: TaskSet) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskSet: (id: string, updates: Partial<TaskSet>) => void;
  deleteTask: (id: string) => void;
  deleteTaskSet: (id: string) => void;
  importData: (data: AppState) => void;
  toggleTaskCompletion: (id: string, showToast?: (message: string, onUndo: () => void) => void) => void;
  toggleTaskSetHidden: (id: string, showToast?: (message: string, onUndo: () => void) => void) => void;
  batchRenameEpisodes: (taskId: string, names: string[], showToast?: (message: string, onUndo: () => void) => void) => void;
}>();

export function AppProvider(props: { children: JSX.Element }) {
  const [state, setState] = createSignal<AppState>(initialState);
  const [currentView, setCurrentView] = createSignal<ViewType>('pending');

  // 自动保存到localStorage
  createEffect(() => {
    saveToStorage(state());
  });

  const addTask = (task: Task) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  };

  const addTaskSet = (taskSet: TaskSet) => {
    setState(prev => ({
      ...prev,
      taskSets: [...prev.taskSets, taskSet]
    }));
  };

  // 向任务集添加任务
  const addTaskToSet = (taskSetId: string, task: Task) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, parentId: taskSetId }]
    }));
  };

  // 向任务集添加子任务集
  const addTaskSetToSet = (parentTaskSetId: string, taskSet: TaskSet) => {
    setState(prev => ({
      ...prev,
      taskSets: [...prev.taskSets, { ...taskSet, parentId: parentTaskSetId }]
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  };

  const updateTaskSet = (id: string, updates: Partial<TaskSet>) => {
    setState(prev => ({
      ...prev,
      taskSets: prev.taskSets.map(taskSet => 
        taskSet.id === id ? { ...taskSet, ...updates } : taskSet
      )
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const deleteTaskSet = (id: string) => {
    setState(prev => ({
      ...prev,
      taskSets: prev.taskSets.filter(taskSet => taskSet.id !== id)
    }));
  };
  
  const importData = (data: AppState) => {
    // 确保数据结构正确
    const validatedData: AppState = {
      taskSets: Array.isArray(data.taskSets) ? data.taskSets : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : []
    };
    
    setState(validatedData);
    // 由于createEffect会自动触发保存，这里不需要手动调用saveToStorage
  };

  const toggleTaskCompletion = (id: string, showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const task = currentState.tasks.find(t => t.id === id);
    
    if (!task) return;
    
    const previousCompleted = task.completed;
    const newCompleted = !previousCompleted;
    
    // 立即更新任务状态
    updateTask(id, { completed: newCompleted });
    
    // 显示撤销提示
    if (showToast) {
      const message = newCompleted 
        ? `已完成「${task.title}」` 
        : `已移至待办「${task.title}」`;
        
      showToast(message, () => {
        // 撤销操作：恢复之前的完成状态
        updateTask(id, { completed: previousCompleted });
      });
    }
  };

  const toggleTaskSetHidden = (id: string, showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const taskSet = currentState.taskSets.find(ts => ts.id === id);
    
    if (!taskSet) return;
    
    const previousHidden = taskSet.hidden;
    const newHidden = !previousHidden;
    
    // 立即更新TaskSet隐藏状态
    updateTaskSet(id, { hidden: newHidden });
    
    // 显示撤销提示
    if (showToast) {
      const message = newHidden 
        ? `已隐藏「${taskSet.title}」` 
        : `已显示「${taskSet.title}」`;
        
      showToast(message, () => {
        // 撤销操作：恢复之前的隐藏状态
        updateTaskSet(id, { hidden: previousHidden });
      });
    }
  };

  const batchRenameEpisodes = (taskId: string, names: string[], showToast?: (message: string, onUndo: () => void) => void) => {
    const currentState = state();
    const task = currentState.tasks.find(t => t.id === taskId);
    
    if (!task || !task.episodes.length) return;
    
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
    updateTask(taskId, { episodes: updatedEpisodes });
    
    // 显示撤销提示
    if (showToast) {
      const renamedCount = Math.min(names.length, task.episodes.length);
      const message = `已批量重命名 ${renamedCount} 个分集`;
      
      showToast(message, () => {
        // 撤销操作：恢复原始的分集标题
        updateTask(taskId, { episodes: originalEpisodes });
      });
    }
  };

  return (
    <AppContext.Provider 
      value={{
        state,
        setState,
        currentView,
        setCurrentView,
        addTask,
        addTaskSet,
        addTaskToSet,
        addTaskSetToSet,
        updateTask,
        updateTaskSet,
        deleteTask,
        deleteTaskSet,
        importData,
        toggleTaskCompletion,
        toggleTaskSetHidden,
        batchRenameEpisodes
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