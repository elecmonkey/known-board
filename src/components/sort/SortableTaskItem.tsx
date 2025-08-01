import { TreeNode } from '@/types';
import { createDraggable } from '@thisbeyond/solid-dnd';
import { transformStyle } from '@thisbeyond/solid-dnd';
import DragHandle from '@/components/sort/DragHandle';

interface SortableTaskItemProps {
  node: TreeNode;
  level: number;
  parentId: string | null;
  index: number;
}

export default function SortableTaskItem(props: SortableTaskItemProps) {
  const draggable = createDraggable(props.node.id, props.node);
  
  return (
    <div
      class={`sortable-task-item ${draggable.isActiveDraggable ? 'dragging' : ''}`}
      style={{ 
        'margin-left': `${props.level * 24}px`,
        transform: draggable.transform ? transformStyle(draggable.transform).transform : undefined,
        opacity: draggable.isActiveDraggable ? 0.5 : 1,
        transition: draggable.isActiveDraggable ? 'none' : 'transform 200ms ease'
      }}
    >
      <div class="flex items-center py-1.5 px-3 bg-white border border-gray-200 rounded-lg mb-1 hover:bg-gray-50">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <span class="text-lg">📝</span>
          <span class="text-gray-900 font-medium truncate">{props.node.title}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">任务</span>
        </div>
        <div use:draggable>
          <DragHandle 
            node={props.node}
            dragActivators={draggable.dragActivators}
            isDragging={draggable.isActiveDraggable}
          />
        </div>
      </div>
    </div>
  );
}