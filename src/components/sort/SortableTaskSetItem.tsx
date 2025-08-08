import { Show } from 'solid-js';
import { TreeNode, isTaskSet } from '@/types/tree';
import { createDraggable } from '@thisbeyond/solid-dnd';
import { transformStyle } from '@thisbeyond/solid-dnd';
import SortableTree from '@/components/sort/SortableTree';
import DragHandle from '@/components/sort/DragHandle';
import DropZone from '@/components/sort/DropZone';
import HideIcon from '@/components/icons/HideIcon';

interface SortableTaskSetItemProps {
  node: TreeNode;
  level: number;
  parentId: string | null;
  index: number;
}

export default function SortableTaskSetItem(props: SortableTaskSetItemProps) {
  const draggable = createDraggable(props.node.id, props.node);
  
  const hasChildren = () => isTaskSet(props.node) && props.node.children.length > 0;
  
  return (
    <div
      class={`sortable-taskset-item ${draggable.isActiveDraggable ? 'dragging' : ''}`}
      style={{ 
        'margin-left': `${props.level == 0 ? 0 : 25}px`,
        transform: draggable.transform ? transformStyle(draggable.transform).transform : undefined,
        opacity: draggable.isActiveDraggable ? 0.5 : 1,
        transition: draggable.isActiveDraggable ? 'none' : 'transform 200ms ease'
      }}
    >
      {/* TaskSet头部 */}
      <div class="flex items-center py-1.5 px-4 bg-blue-50 border border-blue-200 rounded-lg mb-1 hover:bg-blue-100">
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <span class="text-lg">📁</span>
          <span class="text-gray-900 font-medium truncate">{props.node.title}</span>
          {isTaskSet(props.node) && props.node.hidden && (
            <HideIcon class="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
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
      <div class="ml-4 border-l-2 border-gray-100 min-h-[20px]">
        <Show when={!hasChildren()}>
          {/* 空TaskSet的放置区域（稳定锚点：start） */}
          <DropZone parentId={props.node.id} index={0} slot="start" />
        </Show>
        
        <Show when={hasChildren()}>
          <SortableTree 
            nodes={isTaskSet(props.node) ? props.node.children : []} 
            parentId={props.node.id}
            level={props.level + 1}
          />
        </Show>
      </div>
    </div>
  );
}