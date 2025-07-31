import { Task, TaskSet } from '../../types';
import SortTaskItem from './SortTaskItem';
import SortTaskSetItem from './SortTaskSetItem';

// 递归渲染树形结构
export function renderTree(
  taskSets: TaskSet[], 
  tasks: Task[], 
  allTaskSets: TaskSet[], 
  allTasks: Task[], 
  level: number = 0
) {
  const items: any[] = [];
  
  // 渲染当前级别的任务集
  taskSets.forEach(taskSet => {
    const childTaskSets = allTaskSets.filter(ts => ts.parentId === taskSet.id);
    const childTasks = allTasks.filter(t => t.parentId === taskSet.id);
    
    items.push(
      <SortTaskSetItem taskSet={taskSet} level={level}>
        {renderTree(childTaskSets, childTasks, allTaskSets, allTasks, level + 1)}
      </SortTaskSetItem>
    );
  });
  
  // 渲染当前级别的任务
  tasks.forEach(task => {
    items.push(<SortTaskItem task={task} level={level} />);
  });
  
  return items;
}