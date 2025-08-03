import { TreeNode, isTask } from '@/types/tree';
import { createDraggable } from '@thisbeyond/solid-dnd';
import { transformStyle } from '@thisbeyond/solid-dnd';
import DragHandle from '@/components/sort/DragHandle';
import CheckIcon from '@/components/icons/CheckIcon';

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
        'margin-left': `${props.level == 0 ? 0 : 16}px`,
        transform: draggable.transform ? transformStyle(draggable.transform).transform : undefined,
        opacity: draggable.isActiveDraggable ? 0.5 : 1,
        transition: draggable.isActiveDraggable ? 'none' : 'transform 200ms ease'
      }}
    >
      <div class="flex items-center py-1.5 px-4 bg-white border border-gray-200 rounded-lg mb-1 hover:bg-gray-50">
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <span class="text-lg">📝</span>
          <span class="text-gray-900 font-medium truncate">{props.node.title}</span>
          {isTask(props.node) && props.node.completed && (
            <CheckIcon class="w-4 h-4 text-green-600 flex-shrink-0" />
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
    </div>
  );
}