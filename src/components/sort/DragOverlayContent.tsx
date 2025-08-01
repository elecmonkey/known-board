import { useDragDropContext } from '@thisbeyond/solid-dnd';
import { TreeNode } from '@/types';
import CheckIcon from '@/components/icons/CheckIcon';
import HideIcon from '@/components/icons/HideIcon';

export default function DragOverlayContent() {
  const [state] = useDragDropContext()!;
  
  const draggedNode = () => {
    const draggable = state.active.draggable;
    return draggable?.data as TreeNode | null;
  };
  
  const node = draggedNode();
  
  if (!node) return null;
  
  return (
    <div class="drag-overlay-content w-full max-w-4xl">
      <div class={`flex items-center py-1.5 px-4 rounded-lg shadow-lg border w-full ${
        node.type === 'taskSet' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <span class="text-lg">{node.type === 'taskSet' ? '📁' : '📝'}</span>
          <span class="text-gray-900 font-medium truncate">{node.title}</span>
          {node.type === 'task' && node.completed && (
            <CheckIcon class="w-4 h-4 text-green-600 flex-shrink-0" />
          )}
          {node.type === 'taskSet' && node.hidden && (
            <HideIcon class="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
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