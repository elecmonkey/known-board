import { createSignal } from 'solid-js';

interface DeadlineInputProps {
  id: string;
  name: string;
  value: string;
  onInput: (value: string) => void;
}

export default function DeadlineInput(props: DeadlineInputProps) {
  const formatDateToLocal = (date: Date) => {
    // 使用本地时间格式化日期，避免UTC时区转换问题
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickFill = (days: number) => {
    const date = new Date();
    // 重置时间为当天开始，避免时区问题
    date.setHours(0, 0, 0, 0);
    
    if (days === 0) {
      // 今天
      props.onInput(formatDateToLocal(date));
    } else if (days === 1) {
      // 明天
      date.setDate(date.getDate() + 1);
      props.onInput(formatDateToLocal(date));
    } else if (days === 7) {
      // 1周后
      date.setDate(date.getDate() + 7);
      props.onInput(formatDateToLocal(date));
    } else if (days === 30) {
      // 1个月后
      date.setMonth(date.getMonth() + 1);
      props.onInput(formatDateToLocal(date));
    }
  };

  return (
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center">
        <input
          type="date"
          id={props.id}
          name={props.name}
          value={props.value}
          onInput={(e) => props.onInput(e.target.value)}
          class="w-40 px-2 py-1 border border-gray-300 rounded"
        />
        <span class="text-sm text-gray-500">（可选）</span>
      </div>
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