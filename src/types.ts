export interface Episode {
  id: string;
  number: number;
  title: string;
  description?: string;
  deadline?: string;
  videoUrl?: string;
  completed: boolean;
}

// 兼容性：保留原有接口用于数据迁移
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  videoUrl?: string;
  completed: boolean;
  episodes: Episode[];
  parentId?: string; // 所属任务集的ID
}

export interface TaskSet {
  id: string;
  title: string;
  description?: string;
  hidden: boolean;
  parentId?: string; // 父任务集的ID，undefined表示根级别
}

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

// 新的应用状态结构 (v2.0)
export interface AppStateV2 {
  version: '2.0';
  children: TreeNode[];
}

// 兼容旧版本的状态结构 (v1.0)
export interface AppStateV1 {
  version?: '1.0' | undefined;  // 1.0版本可能没有version字段
  taskSets: TaskSet[];
  tasks: Task[];
}

// 旧的AppState接口，保持向后兼容
export interface AppState extends AppStateV1 {}

// 联合类型，用于版本检测
export type AppStateAny = AppStateV1 | AppStateV2;

export type ViewType = 'pending' | 'completed' | 'all' | 'sort';

// 用于树形展示的接口
export interface TaskSetNode extends TaskSet {
  children: TaskSetNode[];
  tasks: Task[];
}