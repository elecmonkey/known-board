import { Episode } from './episode';

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