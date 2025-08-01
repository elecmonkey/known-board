import { createSignal, createContext, useContext, JSX } from 'solid-js';
import UndoIcon from '@/components/icons/UndoIcon';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'undo';
  duration?: number;
  onUndo?: () => void;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  showUndoToast: (message: string, onUndo: () => void, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>();

export function ToastProvider(props: { children: JSX.Element }) {
  const [toasts, setToasts] = createSignal<ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    const newToast: ToastItem = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // 自动移除toast
    const duration = toast.duration ?? 3000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const showUndoToast = (message: string, onUndo: () => void, duration = 3000) => {
    showToast({
      message,
      type: 'undo',
      duration,
      onUndo
    });
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleUndo = (toast: ToastItem) => {
    if (toast.onUndo) {
      toast.onUndo();
    }
    removeToast(toast.id);
  };

  return (
    <ToastContext.Provider value={{ showToast, showUndoToast }}>
      {props.children}
      
      {/* Toast容器 */}
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {toasts().map(toast => (
          <div
            class={`
              flex items-center justify-between px-4 py-2 rounded-lg shadow-lg
              max-w-sm w-full
              ${toast.type === 'undo' 
                ? 'bg-gray-800 text-white' 
                : toast.type === 'success' 
                  ? 'bg-green-500 text-white'
                  : toast.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
              }
            `}
          >
            <span class="flex-1 text-sm font-medium mr-3">
              {toast.message}
            </span>
            
            {toast.type === 'undo' && toast.onUndo && (
              <button
                onClick={() => handleUndo(toast)}
                class="text-white/80 hover:text-white"
                title="撤销"
              >
                <UndoIcon class="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}