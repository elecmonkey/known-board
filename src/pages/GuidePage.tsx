import PlusIcon from '@/components/icons/PlusIcon';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import HideIcon from '@/components/icons/HideIcon';
import ShowIcon from '@/components/icons/ShowIcon';

import { onMount } from 'solid-js';
import { useApp } from '@/store';

function B(props: { children: any }) {
  return <span class="bg-gray-300 rounded-sm p-0.5">{props.children}</span>;
}

export default function GuidePage() {
  const { setPageTitle } = useApp();
  
  onMount(() => {
    setPageTitle("使用指南");
  });

  return (
    <div class="max-w-4xl mx-auto py-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">使用指南</h1>
        
        <div class="prose prose-gray max-w-none">
          <p class="text-gray-700 mb-4">
            欢迎使用 Known Board！这是一个专为管理学习资源（如网课、书籍等系列内容）而设计的任务管理工具。
          </p>
          
          <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">核心概念</h2>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">任务集</h3>
          <p class="text-gray-700 mb-2">
            任务集是用来组织相关任务的容器，例如一个领域或者一个学科。你可以将相关的任务归类到同一个任务集中。
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>任务集可以任意嵌套，创建任意层级结构</li>
            <li>任务集可以包含任务和其他任务集</li>
          </ul>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">任务</h3>
          <p class="text-gray-700 mb-2">
            任务代表具体的学习项目，如一本书或者一个网课系列。
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>可以设置截止日期、描述和视频链接</li>
            <li>可以添加分集以管理更细粒度的内容</li>
          </ul>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">分集</h3>
          <p class="text-gray-700 mb-2">
            分集是任务的子项目，适用于需要进一步细分的内容，如网课的各个小节或书籍章节中的小节。
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>可以批量创建、批量命名</li>
            <li>可以单独标记完成状态</li>
          </ul>
          
          <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">完成任务</h2>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">任务与分集可以<B>完成</B></h3>
          <p class="text-gray-700 mb-2">
            当你完成一个学习任务或任务的某个分集时，可以将其标记为<B>完成</B>：
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>点击任务或分集左侧的复选框将其标记为完成</li>
            <li>完成的任务在<B>待办</B>视图中会被隐藏，在<B>已完成</B>视图中会显示</li>
            <li>完成的分集会更新任务的<B>完成</B>进度显示，但与其所属任务是否完成没有关系</li>
          </ul>

          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">任务集可以<B>隐藏</B></h3>
          <p class="text-gray-700 mb-2">
            当一个任务集学完后，可以将其<B>隐藏</B>：
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>点击任务集右侧的 <B><HideIcon class="inline w-4 h-4" /></B> 图标将其隐藏</li>
            <li>隐藏后，任务集及其所有子任务（子任务集）在<B>待办</B>和<B>已完成</B>视图中都不会显示，有需要可以在<B>所有任务</B>视图中取消隐藏、编辑信息</li>
          </ul>
          
          <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">基本操作</h2>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">创建项目</h3>
          <ol class="list-decimal pl-5 space-y-2 text-gray-700 mb-3">
            <li>点击页面底部的 <B><PlusIcon class="inline w-4 h-4" /></B> 按钮</li>
            <li>选择创建<B>任务</B>或<B>任务集</B></li>
          </ol>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">管理任务</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>标记完成：点击任务左侧的复选框</li>
            <li>编辑：点击任务右侧的 <B><EditIcon class="inline w-4 h-4" /></B> 图标</li>
            <li>删除：点击任务右侧的 <B><DeleteIcon class="inline w-4 h-4" /></B> 图标</li>
            <li>添加分集：在任务中点击<B>添加分集</B>或<B>批量创建</B></li>
          </ul>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">管理任务集</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>展开/折叠：点击任务集左侧的文件夹图标 <B>📂</B>/<B>📁</B></li>
            <li>隐藏/显示：点击任务集右侧的 <B><HideIcon class="inline w-4 h-4" /></B>/<B><ShowIcon class="inline w-4 h-4" /></B> 图标</li>
            <li>添加子项目：点击任务集右侧的 <B><PlusIcon class="inline w-4 h-4" /></B> 图标</li>
          </ul>
          
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">排序</h3>
          <p class="text-gray-700 mb-2">
            在排序页面中，你可以通过拖拽来重新排列任务和任务集的顺序、嵌套关系
          </p>
          
          <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">数据管理</h2>
          <h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">导出和导入</h3>
          <p class="text-gray-700 mb-2">
            你可以在页面底部找到<B>导出</B>和<B>导入</B>功能：
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-700 mb-3">
            <li>导出：将当前所有数据保存为JSON文件</li>
            <li>导入：从JSON文件恢复数据</li>
          </ul>
          <p class="text-gray-700 mb-2">
            数据存储在浏览器本地，清除浏览器数据可能会导致信息丢失，请定期<B>导出</B>重要数据。
          </p>
        </div>
      </div>
    </div>
  );
}