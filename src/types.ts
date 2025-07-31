export interface Episode {
  id: string;
  number: number;
  title: string;
  description?: string;
  deadline?: string;
  videoUrl?: string;
  completed: boolean;
}

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

export interface AppState {
  taskSets: TaskSet[];
  tasks: Task[];
}

export type ViewType = 'pending' | 'completed' | 'all' | 'sort';

// 用于树形展示的接口
export interface TaskSetNode extends TaskSet {
  children: TaskSetNode[];
  tasks: Task[];
}