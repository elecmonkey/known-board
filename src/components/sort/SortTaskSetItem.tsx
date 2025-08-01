import { TreeNode } from '@/types/tree';

interface SortTaskSetItemProps {
  node: TreeNode;
  level: number;
  children: any;
}

export default function SortTaskSetItem(props: SortTaskSetItemProps) {
  return (
    <div>
      <div 
        class="flex items-center py-2 px-3 bg-blue-50 border border-blue-200 rounded-lg mb-2 hover:bg-blue-100 cursor-move"
        style={{ 'margin-left': `${props.level * 24}px` }}
      >
        <div class="flex items-center space-x-3 flex-1">
          <span class="text-lg">📁</span>
          <span class="text-gray-900 font-medium">{props.node.title}</span>
          <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">任务集</span>
        </div>
        <div class="text-gray-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1z"/>
          </svg>
        </div>
      </div>
      {props.children}
    </div>
  );
}