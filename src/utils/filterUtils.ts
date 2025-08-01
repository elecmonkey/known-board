import { Task, TaskSet } from '@/types';

/**
 * 检查任务是否属于隐藏的TaskSet（递归检查所有父级）
 */
export const isTaskInHiddenSet = (task: Task, taskSets: TaskSet[]): boolean => {
  if (!task.parentId) return false;
  
  const parentSet = taskSets.find(ts => ts.id === task.parentId);
  if (!parentSet) return false;
  
  if (parentSet.hidden) return true;
  
  // 如果父TaskSet有父级，递归检查
  if (parentSet.parentId) {
    return isTaskSetInHiddenParent(parentSet, taskSets);
  }
  
  return false;
};

/**
 * 检查TaskSet是否属于隐藏的父TaskSet（递归检查所有父级）
 */
export const isTaskSetInHiddenParent = (taskSet: TaskSet, taskSets: TaskSet[]): boolean => {
  if (!taskSet.parentId) return false;
  
  const parentSet = taskSets.find(ts => ts.id === taskSet.parentId);
  if (!parentSet) return false;
  
  if (parentSet.hidden) return true;
  
  return isTaskSetInHiddenParent(parentSet, taskSets);
};

/**
 * 过滤出非隐藏的根级任务和TaskSet
 */
export const filterVisibleItems = (
  tasks: Task[], 
  taskSets: TaskSet[], 
  taskFilter?: (task: Task) => boolean
) => {
  const filteredTasks = tasks.filter(task => {
    const isRootLevel = !task.parentId;
    const notInHiddenSet = !isTaskInHiddenSet(task, taskSets);
    const passesCustomFilter = taskFilter ? taskFilter(task) : true;
    
    return isRootLevel && notInHiddenSet && passesCustomFilter;
  });
  
  const filteredTaskSets = taskSets.filter(ts => {
    const isRootLevel = !ts.parentId;
    const notHidden = !ts.hidden;
    const notInHiddenParent = !isTaskSetInHiddenParent(ts, taskSets);
    
    return isRootLevel && notHidden && notInHiddenParent;
  });
  
  return { tasks: filteredTasks, taskSets: filteredTaskSets };
};