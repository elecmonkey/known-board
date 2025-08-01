import { For, Show } from 'solid-js';
import { Key } from '@solid-primitives/keyed';
import TaskSetItem from '@/components/TaskSetItem';
import TaskItem from '@/components/TaskItem';
import Divider from '@/components/Divider';
import { Task, TaskSet } from '@/types';

interface TaskListProps {
  tasks: Task[];
  taskSets: TaskSet[];
  emptyState: {
    icon: string;
    title: string;
    description: string;
  };
}

export default function TaskList(props: TaskListProps) {
  return (
    <div>
      <For each={props.taskSets}>
        {(taskSet, index) => (
          <>
            <TaskSetItem taskSet={taskSet} />
            <Show when={index() < props.taskSets.length - 1 || props.tasks.length > 0}>
              <Divider class="my-2" />
            </Show>
          </>
        )}
      </For>
      
      <Key each={props.tasks} by={(task) => task.id}>
        {(task, index) => (
          <>
            <TaskItem task={task()} />
            <Show when={index() < props.tasks.length - 1}>
              <Divider class="my-2" />
            </Show>
          </>
        )}
      </Key>
      
      {props.tasks.length === 0 && props.taskSets.length === 0 && (
        <div class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">{props.emptyState.icon}</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{props.emptyState.title}</h3>
          <p class="text-gray-500">{props.emptyState.description}</p>
        </div>
      )}
    </div>
  );
}