import { TreeNode } from '@/types';

interface SortTaskItemProps {
  node: TreeNode;
  level: number;
}

export default function SortTaskItem(props: SortTaskItemProps) {
  return (
    <div 
      class="flex items-center py-2 px-3 bg-white border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 cursor-move"
      style={{ 'margin-left': `${props.level * 24}px` }}
    >
      <div class="flex items-center space-x-3 flex-1">
        <span class="text-lg">📝</span>
        <span class="text-gray-900 font-medium">{props.node.title}</span>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">任务</span>
      </div>
      <div class="text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1z"/>
        </svg>
      </div>
    </div>
  );
}