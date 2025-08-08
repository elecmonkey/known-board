import { Show } from 'solid-js';
import { Key } from '@solid-primitives/keyed';
import TaskSetItem from '@/components/task/TaskSetItem';
import TaskItem from '@/components/task/TaskItem';
import Divider from '@/components/layout/Divider';
import { TreeNode, isTaskSet } from '@/types/tree';

interface TaskListProps {
  nodes: TreeNode[];
  emptyState: {
    icon: string;
    title: string;
    description: string;
  };
}

export default function TaskList(props: TaskListProps) {
  return (
    <div>
      <Key each={props.nodes} by={(node) => node.id}>
        {(node, index) => (
          <>
            {(() => {
              const nodeValue = node();
              if (isTaskSet(nodeValue)) {
                return <TaskSetItem taskSet={nodeValue} />;
              } else {
                return <TaskItem task={nodeValue} />;
              }
            })()}
            <Show when={index() < props.nodes.length - 1}>
              <Divider class="my-2" />
            </Show>
          </>
        )}
      </Key>
      
      {props.nodes.length === 0 && (
        <div class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">{props.emptyState.icon}</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{props.emptyState.title}</h3>
          <p class="text-gray-500">{props.emptyState.description}</p>
        </div>
      )}
    </div>
  );
}