import { TreeNode } from '@/types/tree';

interface DragHandleProps {
  node: TreeNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragActivators: Record<string, any>; // solid-dnd的dragActivators类型
  isDragging: boolean;
}

export default function DragHandle(props: DragHandleProps) {
  let startTime = 0;
  let startPos = { x: 0, y: 0 };
  let hasMoved = false;
  let isDragAllowed = false;

  const handlePointerDown = (e: PointerEvent) => {
    startTime = Date.now();
    startPos = { x: e.clientX, y: e.clientY };
    hasMoved = false;
    isDragAllowed = false;
    console.log('[DragHandle] Pointer down on handle');
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (startTime > 0) {
      const deltaX = Math.abs(e.clientX - startPos.x);
      const deltaY = Math.abs(e.clientY - startPos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 5) { // 移动超过5px才算拖拽
        hasMoved = true;
        isDragAllowed = true;
        console.log('[DragHandle] Movement detected, allowing drag');
      }
    }
  };

  const handlePointerUp = (/*e: PointerEvent*/) => {
    const elapsed = Date.now() - startTime;
    
    if (elapsed < 200 && !hasMoved) {
      // 快速点击且没有移动 - 阻止拖拽
      console.log('[DragHandle] Click detected, preventing drag');
      isDragAllowed = false;
    }
    
    startTime = 0;
    hasMoved = false;
  };

  // 过滤 dragActivators，只在允许拖拽时才应用
  const filteredDragActivators = Object.fromEntries(
    Object.entries(props.dragActivators).map(([key, handler]) => [
      key,
      (e: Event) => {
        if (!isDragAllowed && (key === 'onpointerdown' || key === 'onmousedown' || key === 'ontouchstart')) {
          console.log('[DragHandle] Drag activator blocked for', key);
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        console.log('[DragHandle] Drag activator allowed for', key);
        handler(e);
      }
    ])
  );

  return (
    <div
      class={`drag-handle ${props.isDragging ? 'dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...filteredDragActivators}
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