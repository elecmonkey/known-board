import { TreeNode } from './tree';
import { Task, TaskSet } from './legacy';

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

// 旧的AppState类型，保持向后兼容
export type AppState = AppStateV1;

// 联合类型，用于版本检测
export type AppStateAny = AppStateV1 | AppStateV2;

// 用于树形展示的接口
export interface TaskSetNode extends TaskSet {
  children: TaskSetNode[];
  tasks: Task[];
}