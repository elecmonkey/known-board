import { createSignal, Show } from 'solid-js';
import DeadlineInput from '@/components/form/DeadlineInput';
import VideoUrlInput from '@/components/form/VideoUrlInput';

interface AddItemFormProps {
  onAdd: (type: 'task' | 'taskset', title: string, description?: string, deadline?: string, videoUrl?: string) => void;
  onCancel: () => void;
  title?: string;
  placeholder?: string;
}

export default function AddItemForm(props: AddItemFormProps) {
  const [addType, setAddType] = createSignal<'task' | 'taskset'>('task');
  const [newTitle, setNewTitle] = createSignal('');
  const [newDescription, setNewDescription] = createSignal('');
  const [newDeadline, setNewDeadline] = createSignal('');
  const [newVideoUrl, setNewVideoUrl] = createSignal('');
  
  // 为每个AddItemForm实例生成唯一ID
  const formId = crypto.randomUUID();

  const handleAdd = () => {
    if (!newTitle().trim()) return;
    props.onAdd(
      addType(), 
      newTitle(), 
      newDescription() || undefined,
      newDeadline() || undefined,
      newVideoUrl() || undefined
    );
    setNewTitle('');
    setNewDescription('');
    setNewDeadline('');
    setNewVideoUrl('');
  };

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setNewDeadline('');
    setNewVideoUrl('');
    props.onCancel();
  };

  return (
    <div class="p-6 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {props.title || '添加新项目'}
      </h3>
      
      <div class="space-y-4">
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              type="radio"
              id={`add-form-type-task-${formId}`}
              name={`add-form-type-${formId}`}
              checked={addType() === 'task'}
              onChange={() => setAddType('task')}
              class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            任务
          </label>
          <label class="flex items-center">
            <input
              type="radio"
              id={`add-form-type-taskset-${formId}`}
              name={`add-form-type-${formId}`}
              checked={addType() === 'taskset'}
              onChange={() => setAddType('taskset')}
              class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            任务集
          </label>
        </div>
        
        <div>
          <input
            type="text"
            id={`add-form-title-${formId}`}
            name={`add-form-title-${formId}`}
            value={newTitle()}
            onInput={(e) => setNewTitle(e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={props.placeholder || (addType() === 'task' ? '任务标题' : '任务集标题')}
          />
        </div>
        
        <div>
          <textarea
            id={`add-form-description-${formId}`}
            name={`add-form-description-${formId}`}
            value={newDescription()}
            onInput={(e) => setNewDescription(e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="3"
            placeholder="描述（可选）"
          />
        </div>
        
        <Show when={addType() === 'task'}>
          <div>
            <DeadlineInput 
              id={`add-form-deadline-${formId}`}
              name={`add-form-deadline-${formId}`}
              value={newDeadline()}
              onInput={setNewDeadline}
            />
          </div>
          
          <div>
            <VideoUrlInput 
              id={`add-form-video-url-${formId}`}
              name={`add-form-video-url-${formId}`}
              value={newVideoUrl()}
              onInput={setNewVideoUrl}
            />
          </div>
        </Show>
        
        <div class="flex space-x-3">
          <button
            onClick={handleAdd}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            添加
          </button>
          <button
            onClick={handleCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}