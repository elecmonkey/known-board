import { createSignal, For, createMemo } from 'solid-js';
import { Task, Episode } from '../types';
import { useApp } from '../store';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import PlusIcon from './icons/PlusIcon';

interface TaskItemProps {
  task: Task;
  depth?: number;
}

export default function TaskItem(props: TaskItemProps) {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [showEpisodes, setShowEpisodes] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal(props.task.title);
  const [editDescription, setEditDescription] = createSignal(props.task.description || '');
  const [editDeadline, setEditDeadline] = createSignal(props.task.deadline || '');
  const [editVideoUrl, setEditVideoUrl] = createSignal(props.task.videoUrl || '');
  const [batchCount, setBatchCount] = createSignal(1);
  
  const { updateTask, deleteTask } = useApp();
  const depth = props.depth || 0;
  
  // 创建一个记忆化的episodes计数，用于检测episodes变化
  const episodesCount = createMemo(() => props.task.episodes.length);

  const handleSave = () => {
    updateTask(props.task.id, {
      title: editTitle(),
      description: editDescription() || undefined,
      deadline: editDeadline() || undefined,
      videoUrl: editVideoUrl() || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(props.task.title);
    setEditDescription(props.task.description || '');
    setEditDeadline(props.task.deadline || '');
    setEditVideoUrl(props.task.videoUrl || '');
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    updateTask(props.task.id, { completed: !props.task.completed });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个任务吗？')) {
      deleteTask(props.task.id);
    }
  };

  const addEpisode = () => {
    const newEpisode: Episode = {
      id: crypto.randomUUID(),
      number: props.task.episodes.length + 1,
      title: `第 ${props.task.episodes.length + 1} 集`,
      completed: false
    };
    
    updateTask(props.task.id, {
      episodes: [...props.task.episodes, newEpisode]
    });
    // 确保添加分集后保持分集展开状态
    setShowEpisodes(true);
  };

  const addBatchEpisodes = () => {
    const count = batchCount();
    if (count <= 0) return;
    
    const newEpisodes = Array.from({ length: count }, (_, i) => {
      const number = props.task.episodes.length + i + 1;
      return {
        id: crypto.randomUUID(),
        number,
        title: `第 ${number} 集`,
        completed: false
      };
    });
    
    updateTask(props.task.id, {
      episodes: [...props.task.episodes, ...newEpisodes]
    });
    
    setBatchCount(1);
    // 确保批量添加分集后保持分集展开状态
    setShowEpisodes(true);
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    const updatedEpisodes = props.task.episodes.map(episode =>
      episode.id === id ? { ...episode, ...updates } : episode
    );
    updateTask(props.task.id, { episodes: updatedEpisodes });
    // 确保更新分集后保持分集展开状态
    setShowEpisodes(true);
  };

  const deleteEpisode = (id: string) => {
    const updatedEpisodes = props.task.episodes.filter(episode => episode.id !== id);
    // 重新编号
    const renumberedEpisodes = updatedEpisodes.map((episode, index) => ({
      ...episode,
      number: index + 1
    }));
    updateTask(props.task.id, { episodes: renumberedEpisodes });
    // 确保删除分集后保持分集展开状态
    setShowEpisodes(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div style={`margin-left: ${depth * 12}px`}>
      <div class={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2 ${
        props.task.completed ? 'bg-green-50 border-green-200' : ''
      }`}>
        <div class="flex items-start">
          <button
            onClick={toggleCompleted}
            class={`flex-shrink-0 w-5 h-5 rounded border mr-3 mt-1 flex items-center justify-center ${
              props.task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {props.task.completed && '✓'}
          </button>
          
          <div class="flex-1">
            {isEditing() ? (
              <div class="space-y-3">
                <input
                  type="text"
                  value={editTitle()}
                  onInput={(e) => setEditTitle(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded"
                  placeholder="任务标题"
                />
                
                <textarea
                  value={editDescription()}
                  onInput={(e) => setEditDescription(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded resize-none"
                  rows="2"
                  placeholder="描述（可选）"
                />
                
                <input
                  type="date"
                  value={editDeadline()}
                  onInput={(e) => setEditDeadline(e.target.value)}
                  class="px-2 py-1 border border-gray-300 rounded"
                />
                
                <input
                  type="text"
                  value={editVideoUrl()}
                  onInput={(e) => setEditVideoUrl(e.target.value)}
                  class="w-full px-2 py-1 border border-gray-300 rounded"
                  placeholder="视频链接或说明"
                />
                
                <div class="flex space-x-2">
                  <button
                    onClick={handleSave}
                    class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class={`font-medium ${props.task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {props.task.title}
                    </h3>
                    
                    {props.task.description && (
                      <p class="text-sm text-gray-600 mt-1">{props.task.description}</p>
                    )}
                    
                    <div class="flex flex-wrap gap-2 mt-2 text-xs">
                      {props.task.deadline && (
                        <span class={`px-2 py-1 rounded ${
                          props.task.completed 
                            ? 'bg-green-100 text-green-800' 
                            : new Date(props.task.deadline) < new Date() 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          截止: {formatDate(props.task.deadline)}
                        </span>
                      )}
                      
                      {props.task.videoUrl && (
                        <span class="px-2 py-1 rounded bg-purple-100 text-purple-800">
                          🎥 视频
                        </span>
                      )}
                      
                      {props.task.episodes.length > 0 && (
                        <span class={`px-2 py-1 rounded ${
                          props.task.episodes.filter(e => e.completed).length === props.task.episodes.length
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          分集: {props.task.episodes.filter(e => e.completed).length}/{props.task.episodes.length}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div class="flex space-x-1">
                    <button
                      onClick={() => setIsEditing(true)}
                      class="text-blue-600 hover:text-blue-800 p-1"
                      title="编辑"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={handleDelete}
                      class="text-red-600 hover:text-red-800 p-1"
                      title="删除"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
                
                {props.task.episodes.length > 0 && (
                  <div class="mt-3">
                    <button
                      onClick={() => setShowEpisodes(!showEpisodes())}
                      class="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                    >
                      {showEpisodes() ? '收起分集' : '展开分集'} ({props.task.episodes.length})
                      <span class="ml-1">{showEpisodes() ? '▲' : '▼'}</span>
                    </button>
                  </div>
                )}
                
                {!props.task.episodes.length && (
                  <div class="mt-3 flex items-center space-x-2">
                    <button
                      onClick={addEpisode}
                      class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <PlusIcon class="w-4 h-4 mr-1" />
                      添加分集
                    </button>
                    <span class="text-gray-300">|</span>
                    <div class="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={batchCount()}
                        onInput={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                        class="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <button
                        onClick={addBatchEpisodes}
                        class="text-sm text-green-600 hover:text-green-800 flex items-center"
                      >
                        <PlusIcon class="w-4 h-4 mr-1" />
                        批量创建
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
        
        {/* 当showEpisodes为true时展开 */}
        {showEpisodes() && (
          <div class="mt-4 pl-2 border-l-2 border-gray-200 space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-700">分集列表</h4>
              <div class="flex space-x-2">
                <button
                  onClick={addEpisode}
                  class="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <PlusIcon class="w-3 h-3 mr-1" />
                  添加分集
                </button>
                <span class="text-gray-300">|</span>
                <div class="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={batchCount()}
                    onInput={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                    class="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded"
                  />
                  <button
                    onClick={addBatchEpisodes}
                    class="text-xs text-green-600 hover:text-green-800 flex items-center"
                  >
                    <PlusIcon class="w-3 h-3 mr-1" />
                    批量创建
                  </button>
                </div>
              </div>
            </div>
            
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <For each={props.task.episodes}>
                {(episode) => (
                  <div class={`flex items-center p-2 rounded ${
                    episode.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <button
                      onClick={() => updateEpisode(episode.id, { completed: !episode.completed })}
                      class={`flex-shrink-0 w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                        episode.completed 
                          ? 'bg-green-500 border-green-500 text-white text-xs' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {episode.completed && '✓'}
                    </button>
                    
                    <span class={`text-sm flex-1 truncate ${
                      episode.completed ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}>
                      {episode.number}. {episode.title || `第 ${episode.number} 集`}
                    </span>
                    
                    <div class="flex space-x-1">
                      <button
                        onClick={() => {
                          const newTitle = prompt('输入新的分集标题:', episode.title || '');
                          if (newTitle !== null) {
                            updateEpisode(episode.id, { title: newTitle || undefined });
                          }
                        }}
                        class="text-xs text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个分集吗？')) {
                            deleteEpisode(episode.id);
                          }
                        }}
                        class="text-xs text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
