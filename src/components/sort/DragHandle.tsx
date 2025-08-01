import { TreeNode } from '@/types/tree';

interface DragHandleProps {
  node: TreeNode;
  dragActivators: Record<string, any>; // solid-dnd的dragActivators类型
  isDragging: boolean;
}

export default function DragHandle(props: DragHandleProps) {
  return (
    <div
      class={`drag-handle ${props.isDragging ? 'dragging' : ''}`}
      {...props.dragActivators}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="currentColor"
        class="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1z"/>
      </svg>
    </div>
  );
}