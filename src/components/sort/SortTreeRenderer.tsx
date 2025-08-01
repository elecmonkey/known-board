import { TreeNode } from '@/types';
import SortTaskItem from '@/components/sort/SortTaskItem';
import SortTaskSetItem from '@/components/sort/SortTaskSetItem';

// 递归渲染树形结构
export function renderTree(
  nodes: TreeNode[], 
  level: number = 0
) {
  const items: any[] = [];
  
  // 渲染当前级别的所有节点
  nodes.forEach(node => {
    if (node.type === 'taskSet') {
      items.push(
        <SortTaskSetItem node={node} level={level}>
          {node.children && node.children.length > 0 ? 
            renderTree(node.children, level + 1) : null}
        </SortTaskSetItem>
      );
    } else {
      items.push(<SortTaskItem node={node} level={level} />);
    }
  });
  
  return items;
}