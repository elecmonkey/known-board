/**
 * 数据版本管理和迁移工具
 */

import { AppStateV1, AppStateV2, AppStateAny } from '@/types/app-state';
import { TreeNode, Task, TaskSet, isTaskSet } from '@/types/tree';
import { Task as LegacyTask, TaskSet as LegacyTaskSet } from '@/types/legacy';

export const CURRENT_VERSION = '2.0' as const;

/**
 * 检测数据版本
 */
export function detectDataVersion(data: any): '1.0' | '2.0' | 'unknown' {
  if (!data || typeof data !== 'object') {
    return 'unknown';
  }

  // 检查是否为 2.0 版本
  if (data.version === '2.0' && Array.isArray(data.children)) {
    return '2.0';
  }

  // 检查是否为 1.0 版本（显式或隐式）
  if (
    data.version === '1.0' || 
    (Array.isArray(data.taskSets) && Array.isArray(data.tasks))
  ) {
    return '1.0';
  }

  return 'unknown';
}

/**
 * 验证 TreeNode 结构的有效性
 */
export function validateTreeNode(node: any): node is TreeNode {
  return (
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    (node.type === 'task' || node.type === 'taskSet') &&
    typeof node.title === 'string' &&
    (node.children === undefined || Array.isArray(node.children))
  );
}

/**
 * 验证 AppStateV2 结构的有效性
 */
export function validateAppStateV2(data: any): data is AppStateV2 {
  return (
    data &&
    typeof data === 'object' &&
    data.version === '2.0' &&
    Array.isArray(data.children) &&
    data.children.every(validateTreeNode)
  );
}

/**
 * 将 1.0 版本数据迁移到 2.0 版本
 */
export function migrateV1ToV2(v1Data: AppStateV1): AppStateV2 {
  console.log('开始数据迁移: 1.0 → 2.0');
  
  // 验证输入数据
  if (!Array.isArray(v1Data.taskSets) || !Array.isArray(v1Data.tasks)) {
    throw new Error('无效的 1.0 版本数据格式');
  }

  // 1. 构建 parentId -> children 的映射关系
  const childrenMap = new Map<string | undefined, TreeNode[]>();

  // 2. 转换所有 TaskSet 为 TreeNode
  v1Data.taskSets.forEach(taskSet => {
    const node: TreeNode = {
      type: 'taskSet',
      id: taskSet.id,
      title: taskSet.title,
      description: taskSet.description,
      hidden: taskSet.hidden,
      expanded: true, // 默认展开状态
      children: []
    };

    const parentId = taskSet.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(node);
  });

  // 3. 转换所有 Task 为 TreeNode
  v1Data.tasks.forEach(task => {
    const node: TreeNode = {
      type: 'task',
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      deadline: task.deadline,
      videoUrl: task.videoUrl,
      episodes: task.episodes
    };

    const parentId = task.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(node);
  });

  // 4. 递归构建树结构
  function buildTree(nodes: TreeNode[]): TreeNode[] {
    return nodes.map(node => {
      if (isTaskSet(node)) {
        const children = childrenMap.get(node.id) || [];
        return {
          ...node,
          children: buildTree(children)
        };
      }
      return node;
    });
  }

  // 5. 构建根级别的子节点
  const rootChildren = childrenMap.get(undefined) || [];
  const result: AppStateV2 = {
    version: '2.0',
    children: buildTree(rootChildren)
  };

  console.log(`数据迁移完成: 转换了 ${v1Data.taskSets.length} 个任务集和 ${v1Data.tasks.length} 个任务`);
  
  return result;
}

/**
 * 通用数据加载器 - 自动处理版本检测和迁移
 */
export function loadAppData(rawData: any): AppStateV2 {
  const version = detectDataVersion(rawData);

  switch (version) {
    case '2.0':
      if (validateAppStateV2(rawData)) {
        return rawData;
      } else {
        console.warn('2.0 版本数据格式验证失败，使用默认数据');
        return createDefaultAppState();
      }

    case '1.0':
      console.log('检测到 1.0 版本数据，正在迁移...');
      try {
        return migrateV1ToV2(rawData as AppStateV1);
      } catch (error) {
        console.error('数据迁移失败:', error);
        return createDefaultAppState();
      }

    case 'unknown':
    default:
      console.warn('未知数据格式，使用默认数据');
      return createDefaultAppState();
  }
}

/**
 * 创建默认的应用状态
 */
export function createDefaultAppState(): AppStateV2 {
  return {
    version: '2.0',
    children: []
  };
}

/**
 * 为导出功能准备数据
 */
export function prepareExportData(appState: AppStateV2) {
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    data: {
      version: appState.version,
      children: appState.children
    }
  };
}