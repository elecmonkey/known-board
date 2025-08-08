/**
 * 导入冲突处理工具
 */

import { TreeNode, isTaskSet } from '@/types/tree';
import { AppStateV2 } from '@/types/app-state';

export interface ConflictItem {
  id: string;
  title: string;
  type: 'task' | 'taskSet';
  node: TreeNode;
}

export interface ConflictInfo {
  conflicts: ConflictItem[];
  hasConflicts: boolean;
}

export type ImportMode = 'replace' | 'merge';
export type ConflictResolution = 'overwrite' | 'keep_old' | 'regenerate_id';

/**
 * 递归获取所有节点ID
 */
function getAllNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  
  function traverse(children: TreeNode[]) {
    children.forEach(node => {
      ids.push(node.id);
      if (isTaskSet(node) && node.children) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return ids;
}

/**
 * 递归获取所有节点
 */
function getAllNodes(nodes: TreeNode[]): TreeNode[] {
  const allNodes: TreeNode[] = [];
  
  function traverse(children: TreeNode[]) {
    children.forEach(node => {
      allNodes.push(node);
      if (isTaskSet(node) && node.children) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return allNodes;
}

/**
 * 检测ID冲突
 */
export function detectConflicts(existingData: TreeNode[], newData: TreeNode[]): ConflictInfo {
  const existingIds = new Set(getAllNodeIds(existingData));
  const conflictNodes = getAllNodes(newData).filter(node => existingIds.has(node.id));
  
  const conflicts: ConflictItem[] = conflictNodes.map(node => ({
    id: node.id,
    title: node.title,
    type: node.type,
    node
  }));
  
  return {
    conflicts,
    hasConflicts: conflicts.length > 0
  };
}

/**
 * 生成新的UUID并递归更新节点及其子节点的ID
 */
function regenerateNodeId(node: TreeNode): TreeNode {
  const newNode = { ...node, id: crypto.randomUUID() };
  
  if (isTaskSet(newNode) && newNode.children) {
    newNode.children = newNode.children.map(child => regenerateNodeId(child));
  }
  
  // 更新episodes的ID（如果存在）
  if (newNode.type === 'task' && newNode.episodes) {
    newNode.episodes = newNode.episodes.map(episode => ({
      ...episode,
      id: crypto.randomUUID()
    }));
  }
  
  return newNode;
}

/**
 * 处理导入数据
 */
export function processImportData(
  existingState: AppStateV2,
  newData: AppStateV2,
  mode: ImportMode,
  conflictResolution?: ConflictResolution
): AppStateV2 {
  // 如果是覆盖模式，直接返回新数据
  if (mode === 'replace') {
    return newData;
  }
  
  // 合并模式
  let processedNewNodes = [...newData.children];
  
  // 检测冲突
  const conflictInfo = detectConflicts(existingState.children, newData.children);
  
  if (conflictInfo.hasConflicts && conflictResolution) {
    switch (conflictResolution) {
      case 'overwrite': {
        // 从现有数据中移除冲突的节点，然后合并
        const conflictIds = new Set(conflictInfo.conflicts.map(c => c.id));
        const filteredExistingNodes = existingState.children.filter(node => 
          !conflictIds.has(node.id)
        );
        return {
          ...existingState,
          children: [...filteredExistingNodes, ...processedNewNodes]
        };
      }
        
      case 'keep_old': {
        // 从新数据中移除冲突的节点
        const conflictIdsSet = new Set(conflictInfo.conflicts.map(c => c.id));
        processedNewNodes = processedNewNodes.filter(node => 
          !conflictIdsSet.has(node.id)
        );
        break;
      }
        
      case 'regenerate_id': {
        // 为冲突的节点重新生成ID
        const conflictIdsRegenSet = new Set(conflictInfo.conflicts.map(c => c.id));
        processedNewNodes = processedNewNodes.map(node => 
          conflictIdsRegenSet.has(node.id) ? regenerateNodeId(node) : node
        );
        break;
      }
    }
  }
  
  // 合并数据
  return {
    ...existingState,
    children: [...existingState.children, ...processedNewNodes]
  };
}

/**
 * 检查是否有现有数据
 */
export function hasExistingData(state: AppStateV2): boolean {
  return state.children && state.children.length > 0;
}