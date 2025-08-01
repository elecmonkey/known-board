import { TreeNode } from '@/types/tree';

/**
 * 检查任务节点是否属于隐藏的TaskSet（递归检查所有父级）
 */
export const isNodeInHiddenParent = (nodeId: string, allNodes: TreeNode[]): boolean => {
  // 在树形结构中找到节点的父节点
  const findParent = (children: TreeNode[], targetId: string): TreeNode | null => {
    for (const node of children) {
      if (node.children) {
        if (node.children.some(child => child.id === targetId)) {
          return node;
        }
        const found = findParent(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const parent = findParent(allNodes, nodeId);
  if (!parent) return false;

  // 如果父节点是隐藏的TaskSet，返回true
  if (parent.type === 'taskSet' && parent.hidden) {
    return true;
  }

  // 递归检查更上级的父节点
  return isNodeInHiddenParent(parent.id, allNodes);
};

/**
 * 递归过滤树形结构中的可见节点
 */
export const filterVisibleNodes = (
  children: TreeNode[],
  nodeFilter?: (node: TreeNode) => boolean
): TreeNode[] => {
  return children.reduce((acc: TreeNode[], node) => {
    // 检查当前节点是否应该显示
    const shouldShowNode = () => {
      // TaskSet节点：不能是隐藏的
      if (node.type === 'taskSet' && node.hidden) {
        return false;
      }
      
      // 应用自定义过滤器
      if (nodeFilter && !nodeFilter(node)) {
        return false;
      }
      
      return true;
    };

    // 递归过滤子节点
    const filteredChildren = node.children ? filterVisibleNodes(node.children, nodeFilter) : [];

    if (shouldShowNode()) {
      // 如果当前节点应该显示，包含它和它过滤后的子节点
      acc.push({
        ...node,
        children: filteredChildren
      });
    }
    // 移除了隐藏taskSet子节点提升的逻辑
    // 隐藏的taskSet及其所有子孙后代都应该完全不显示

    return acc;
  }, []);
};

/**
 * 过滤出根级别的可见节点
 */
export const filterRootVisibleNodes = (
  rootChildren: TreeNode[],
  nodeFilter?: (node: TreeNode) => boolean
) => {
  return filterVisibleNodes(rootChildren, nodeFilter);
};

/**
 * 获取所有任务节点（平铺）
 */
export const getAllTasks = (children: TreeNode[]): TreeNode[] => {
  const tasks: TreeNode[] = [];
  
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.type === 'task') {
        tasks.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  
  traverse(children);
  return tasks;
};

/**
 * 获取所有任务集节点（平铺）
 */
export const getAllTaskSets = (children: TreeNode[]): TreeNode[] => {
  const taskSets: TreeNode[] = [];
  
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.type === 'taskSet') {
        taskSets.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  
  traverse(children);
  return taskSets;
};

/**
 * 兼容旧API：过滤出非隐藏的根级任务和TaskSet
 * @deprecated 使用 filterRootVisibleNodes 替代
 */
export const filterVisibleItems = (
  rootChildren: TreeNode[],
  taskFilter?: (node: TreeNode) => boolean
) => {
  const visibleNodes = filterRootVisibleNodes(rootChildren, (node) => {
    if (taskFilter && node.type === 'task') {
      return taskFilter(node);
    }
    return true;
  });

  return {
    tasks: visibleNodes.filter(node => node.type === 'task'),
    taskSets: visibleNodes.filter(node => node.type === 'taskSet')
  };
};