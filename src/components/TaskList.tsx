import { For, Show } from 'solid-js';
import { Key } from '@solid-primitives/keyed';
import TaskSetItem from '@/components/TaskSetItem';
import TaskItem from '@/components/TaskItem';
import Divider from '@/components/Divider';
import { TreeNode } from '@/types';

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
            {node().type === 'taskSet' ? (
              <TaskSetItem taskSet={node() as TreeNode} />
            ) : (
              <TaskItem task={node() as TreeNode} />
            )}
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