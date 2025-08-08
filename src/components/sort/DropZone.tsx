import { createDroppable } from '@thisbeyond/solid-dnd';

interface DropZoneProps {
  parentId: string | null;
  index: number;
  // 使用稳定锚点来生成 droppable id，避免因 index 变化导致的重复或错位
  // start: 父容器开头的缝隙；after: 指定子节点之后的缝隙
  slot: 'start' | 'after';
  // 当 slot 为 after 时，必须提供稳定的相邻子节点 id
  afterId?: string;
}

export default function DropZone(props: DropZoneProps) {
  const stableDropId = () => {
    const parent = props.parentId || 'root';
    if (props.slot === 'start') return `dz:${parent}:start`;
    // slot === 'after'
    return `dz:${parent}:after:${props.afterId ?? 'unknown'}`;
  };

  // droppable data 仍然携带 parentId 与 index，供 onDragEnd 计算插入位置
  const droppable = createDroppable(stableDropId(), {
    parentId: props.parentId,
    index: props.index,
    slot: props.slot,
    afterId: props.afterId
  });
  
  return (
    <div
      use:droppable
      class={`drop-zone ${droppable.isActiveDroppable ? 'active' : ''}`}
      style={{ 'margin-left': props.parentId ? '16px' : '0px' }}
    >
      <div class="drop-indicator" />
    </div>
  );
}