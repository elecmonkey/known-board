import { createDroppable } from '@thisbeyond/solid-dnd';

interface DropZoneProps {
  parentId: string | null;
  index: number;
}

export default function DropZone(props: DropZoneProps) {
  const dropId = () => `drop-${props.parentId || 'root'}-${props.index}`;
  
  const droppable = createDroppable(dropId(), {
    parentId: props.parentId,
    index: props.index
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