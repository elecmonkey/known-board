import { useDragDropContext } from '@thisbeyond/solid-dnd';
import { TreeNode } from '@/types';

export default function DragOverlayContent() {
  const [state] = useDragDropContext()!;
  
  const draggedNode = () => {
    const draggable = state.active.draggable;
    return draggable?.data as TreeNode | null;
  };
  
  const node = draggedNode();
  
  if (!node) return null;
  
  return (
    <div class="drag-overlay-content">
      <div class={`flex items-center py-1.5 px-3 rounded-lg shadow-lg border ${
        node.type === 'taskSet' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <span class="text-lg">{node.type === 'taskSet' ? '📁' : '📝'}</span>
          <span class="text-gray-900 font-medium truncate">{node.title}</span>
          <span class={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
            node.type === 'taskSet'
              ? 'text-blue-600 bg-blue-100'
              : 'text-gray-500 bg-gray-100'
          }`}>
            {node.type === 'taskSet' ? '任务集' : '任务'}
          </span>
        </div>
        <div class="drag-handle opacity-50">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            class="text-gray-400"
          >
            <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}