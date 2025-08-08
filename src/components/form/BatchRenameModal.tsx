import { createSignal } from 'solid-js';

interface BatchRenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (names: string[]) => void;
  episodeCount: number;
  episodes: Array<{ title: string }>;
}

export default function BatchRenameModal(props: BatchRenameModalProps) {
  // 初始化文本值为当前分集的标题
  const getInitialValue = () => {
    return props.episodes.map(ep => ep.title).join('\n');
  };
  
  const [textValue, setTextValue] = createSignal(getInitialValue());

  const handleConfirm = () => {
    const lines = textValue().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    props.onConfirm(lines);
    setTextValue(getInitialValue()); // 重置为初始值而不是清空
    props.onClose();
  };

  const handleCancel = () => {
    setTextValue(getInitialValue()); // 重置为初始值
    props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            批量命名分集
          </h3>
          
          <p class="text-sm text-gray-600 mb-4">
            当前共有 {props.episodeCount} 个分集。每行对应一个分集的名称，从第一集开始依次命名。
          </p>
          
          <textarea
            value={textValue()}
            onInput={(e) => setTextValue(e.target.value)}
            placeholder={`第一集名称\n第二集名称\n第三集名称\n...`}
            class="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}