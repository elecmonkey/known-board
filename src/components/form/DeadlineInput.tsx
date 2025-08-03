import { createSignal } from 'solid-js';

interface DeadlineInputProps {
  id: string;
  name: string;
  value: string;
  onInput: (value: string) => void;
}

export default function DeadlineInput(props: DeadlineInputProps) {
  const handleQuickFill = (days: number) => {
    const date = new Date();
    if (days === 0) {
      // 今天
      props.onInput(date.toISOString().split('T')[0]);
    } else if (days === 1) {
      // 明天
      date.setDate(date.getDate() + 1);
      props.onInput(date.toISOString().split('T')[0]);
    } else if (days === 7) {
      // 1周后
      date.setDate(date.getDate() + 7);
      props.onInput(date.toISOString().split('T')[0]);
    } else if (days === 30) {
      // 1个月后
      date.setMonth(date.getMonth() + 1);
      props.onInput(date.toISOString().split('T')[0]);
    }
  };

  return (
    <div class="flex flex-wrap items-center gap-2">
      <input
        type="date"
        id={props.id}
        name={props.name}
        value={props.value}
        onInput={(e) => props.onInput(e.target.value)}
        class="w-40 px-2 py-1 border border-gray-300 rounded"
      />
      <div class="flex space-x-1 items-center">
        <label class="text-sm font-medium text-gray-700 whitespace-nowrap">截止</label>
        <button
          type="button"
          onClick={() => handleQuickFill(0)}
          class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          今天
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill(1)}
          class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
        >
          明天
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill(7)}
          class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
        >
          1周后
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill(30)}
          class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
        >
          1个月后
        </button>
      </div>
    </div>
  );
}