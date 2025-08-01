import { Episode } from './episode';

// 新的树形节点结构 (v2.0)
export interface TreeNode {
  id: string;
  type: 'taskSet' | 'task';
  title: string;
  description?: string;
  
  // TaskSet 特有字段
  hidden?: boolean;  // 仅当 type === 'taskSet' 时有效
  
  // Task 特有字段
  completed?: boolean;  // 仅当 type === 'task' 时有效
  deadline?: string;
  videoUrl?: string;
  episodes?: Episode[];
  
  // 树形结构
  children?: TreeNode[];  // TaskSet 可以有子节点，Task 通常为空数组
}