import { Episode } from './episode';

// 基础节点接口
interface BaseNode {
  id: string;
  title: string;
  description?: string;
}

// Task专用类型
export interface Task extends BaseNode {
  completed: boolean;
  deadline?: string;
  videoUrl?: string;
  episodes?: Episode[];
}

// TaskSet专用类型
export interface TaskSet extends BaseNode {
  hidden: boolean;
  children: TreeNode[];
}

// 联合类型 - 用于树节点
export type TreeNode = 
  | ({ type: 'task' } & Task)
  | ({ type: 'taskSet' } & TaskSet)

// 类型守卫函数
export const isTask = (node: TreeNode): node is ({ type: 'task' } & Task) => {
  return node.type === 'task';
}

export const isTaskSet = (node: TreeNode): node is ({ type: 'taskSet' } & TaskSet) => {
  return node.type === 'taskSet';
}