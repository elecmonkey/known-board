import { onMount, onCleanup } from 'solid-js';
import { useApp } from '@/store';
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
  const { state, setCurrentView, moveNode } = useApp();
  
  onMount(() => {
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
        
        // 解析放置区域数据
        const dropData = droppable.data as { parentId: string | null; index: number };
        
        // 验证拖拽数据
        if (!dropData || typeof dropData.index !== 'number') {
          console.warn('Invalid drop data:', dropData);
          return;
        }
        
        // 确保index是有效的数字
        const targetIndex = Math.max(0, Math.floor(dropData.index));
        const targetParentId = dropData.parentId || undefined;
        
        console.log('Executing move:', draggable.id, '→', targetParentId || 'root', 'at index', targetIndex);
        
        moveNode(
          draggable.id as string,
          targetParentId,
          targetIndex
        );
      } else {
        console.log('Drag cancelled or same position');
      }
    });

    const rootNodes = () => state().children;

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