import { Show } from 'solid-js';
import { TreeNode } from '@/types';
import { createDraggable } from '@thisbeyond/solid-dnd';
import { transformStyle } from '@thisbeyond/solid-dnd';
import SortableTree from '@/components/sort/SortableTree';
import DragHandle from '@/components/sort/DragHandle';
import DropZone from '@/components/sort/DropZone';

interface SortableTaskSetItemProps {
  node: TreeNode;
  level: number;
  parentId: string | null;
  index: number;
}

export default function SortableTaskSetItem(props: SortableTaskSetItemProps) {
  const draggable = createDraggable(props.node.id, props.node);
  
  const hasChildren = () => props.node.children && props.node.children.length > 0;
  
  return (
    <div
      class="sortable-taskset-item"
      style={{ 
        'margin-left': `${props.level * 24}px`,
        transform: draggable.transform ? transformStyle(draggable.transform).transform : undefined,
        opacity: draggable.isActiveDraggable ? 0.5 : 1,
        transition: draggable.isActiveDraggable ? 'none' : 'transform 200ms ease'
      }}
    >
      {/* TaskSet头部 */}
      <div class="flex items-center py-1.5 px-3 bg-blue-50 border border-blue-200 rounded-lg mb-1 hover:bg-blue-100">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <span class="text-lg">📁</span>
          <span class="text-gray-900 font-medium truncate">{props.node.title}</span>
          <span class="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded flex-shrink-0">任务集</span>
        </div>
        <div use:draggable>
          <DragHandle 
            node={props.node}
            dragActivators={draggable.dragActivators}
            isDragging={draggable.isActiveDraggable}
          />
        </div>
      </div>
      
      {/* TaskSet内部的放置区域 - 即使没有子元素也要显示 */}
      <div class="ml-6 border-l-2 border-gray-100 pl-4 min-h-[20px]">
        <Show when={!hasChildren()}>
          {/* 空TaskSet的放置区域 */}
          <DropZone parentId={props.node.id} index={0} />
        </Show>
        
        <Show when={hasChildren()}>
          <SortableTree 
            nodes={props.node.children!} 
            parentId={props.node.id}
            level={props.level + 1}
          />
        </Show>
      </div>
    </div>
  );
}