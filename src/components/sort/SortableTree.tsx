import { For } from 'solid-js';
import { TreeNode, isTaskSet } from '@/types/tree';
import SortableTaskItem from '@/components/sort/SortableTaskItem';
import SortableTaskSetItem from '@/components/sort/SortableTaskSetItem';
import DropZone from '@/components/sort/DropZone';

interface SortableTreeProps {
  nodes: TreeNode[];
  parentId?: string | null;
  level?: number;
}

export default function SortableTree(props: SortableTreeProps) {
  const level = () => props.level || 0;
  const parentId = () => props.parentId || null;

  return (
    <div class="sortable-tree">
      {/* 顶部放置区域 */}
      <DropZone parentId={parentId()} index={0} slot="start" />
      
      <For each={props.nodes}>
        {(node, index) => (
          <>
            {(() => {
              if (isTaskSet(node)) {
                return (
                  <SortableTaskSetItem 
                    node={node} 
                    level={level()}
                    parentId={parentId()}
                    index={index()}
                  />
                );
              } else {
                return (
                  <SortableTaskItem 
                    node={node} 
                    level={level()}
                    parentId={parentId()}
                    index={index()}
                  />
                );
              }
            })()}
            {/* 每个元素后的放置区域 */}
            <DropZone parentId={parentId()} index={index() + 1} slot="after" afterId={node.id} />
          </>
        )}
      </For>
    </div>
  );
}