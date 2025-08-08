import { onMount, onCleanup } from 'solid-js';
import { useApp, TreeUtils } from '@/store';
import { 
  DragDropProvider, 
  DragDropSensors,
  useDragDropContext,
  DragOverlay
} from '@thisbeyond/solid-dnd';
import SortableTree from '@/components/sort/SortableTree';
import DragOverlayContent from '@/components/sort/DragOverlayContent';
import '@/components/sort/sort.css';

export default function SortPage() {
  const { state, setCurrentView, moveNode, setPageTitle } = useApp();
  
  onMount(() => {
    setPageTitle("排序");
    setCurrentView('sort');
  });

  // 清理：确保组件卸载时移除dragging类
  onCleanup(() => {
    document.body.classList.remove('dragging');
  });

  const Sandbox = () => {
    const [, { onDragStart, onDragEnd }] = useDragDropContext()!;

    onDragStart(() => {
      // 拖拽开始时禁用页面滚动
      document.body.classList.add('dragging');
    });

    onDragEnd(({ draggable, droppable }) => {
      // 拖拽结束时恢复页面滚动
      document.body.classList.remove('dragging');
      
      if (droppable && draggable.id !== droppable.id) {
        console.log('Drag ended:', draggable.id, 'to', droppable.id);
        console.log('Droppable data:', droppable.data);

        // 解析放置区域数据（包含稳定锚点）
        const dropData = droppable.data as { parentId: string | null; index: number; slot?: 'start' | 'after'; afterId?: string };
        if (!dropData) return;

        // 定位拖拽项的当前父与索引
        let currentIndex = -1;
        let currentParentId: string | undefined = undefined;
        const findCurrentPosition = (nodes: any[], parentId?: string): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === draggable.id) {
              currentIndex = i;
              currentParentId = parentId;
              return true;
            }
            if (nodes[i].children) {
              if (findCurrentPosition(nodes[i].children, nodes[i].id)) return true;
            }
          }
          return false;
        };
        findCurrentPosition(state.children);

        const targetParentId = dropData.parentId || undefined;

        // 基于锚点（start/after:childId）计算插入 index：
        // 先取目标容器的“过滤后子数组”（临时视图：排除被拖拽项），再根据锚点求 index。
        const getTargetChildrenView = (parentId?: string) => {
          if (!parentId) return state.children.filter(n => n.id !== draggable.id);
          const parentNode = TreeUtils.findNode(state.children, parentId);
          if (parentNode && parentNode.type === 'taskSet') {
            return parentNode.children.filter(n => n.id !== draggable.id);
          }
          return [] as any[];
        };

        const filteredChildren = getTargetChildrenView(targetParentId);

        let targetIndex: number;
        if (dropData.slot === 'start') {
          targetIndex = 0;
        } else if (dropData.slot === 'after') {
          if (!dropData.afterId) return; // 缺少锚点信息，放弃此次移动
          const anchorIdx = filteredChildren.findIndex(n => n.id === dropData.afterId);
          if (anchorIdx < 0) return; // 找不到锚点，放弃此次移动
          targetIndex = anchorIdx + 1;
        } else {
          // 兼容旧数据：回退到传入的 index，并做 clamp
          targetIndex = Math.max(0, Math.floor(dropData.index));
        }

        // clamp 到 [0, filteredChildren.length]
        const maxLen = filteredChildren.length;
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > maxLen) targetIndex = maxLen;

        // 同父同位置直接跳过
        if (currentParentId === targetParentId && currentIndex === targetIndex) return;

        console.log('Executing move (anchor-based):', draggable.id, '→', targetParentId || 'root', 'at index', targetIndex);
        moveNode(draggable.id as string, targetParentId, targetIndex);
      } else {
        console.log('Drag cancelled or same position');
      }
    });

    const rootNodes = () => state.children;

    return (
      <div class="max-w-4xl mx-auto py-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">拖拽排序</h1>
          <p class="text-gray-600">拖拽右侧手柄进行排序，支持跨任务集移动</p>
        </div>
        
        {rootNodes().length > 0 ? (
          <SortableTree nodes={rootNodes()} />
        ) : (
          <div class="text-center py-8">
            <div class="text-4xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
            <p class="text-gray-600">请先在其他页面创建任务或任务集</p>
          </div>
        )}

        <DragOverlay>
          <DragOverlayContent />
        </DragOverlay>
      </div>
    );
  };

  return (
    <DragDropProvider>
      <DragDropSensors />
      <Sandbox />
    </DragDropProvider>
  );
}