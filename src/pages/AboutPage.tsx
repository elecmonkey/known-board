export default function AboutPage() {
  return (
    <div class="max-w-4xl mx-auto py-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">关于</h1>
        
        <div class="prose prose-gray max-w-none">
          <p class="text-gray-700 mb-4">
            Known Board 网课看板，一个类 Todo List 应用。
          </p>
          <p class="text-gray-700 mb-4">
            传统 Todo List 在规划学习资源时用起来并不舒服，
            可能需要自己手动重复添加任务，很难对单一学习资源进行统一管理。
            但其实——有一个100集的网课、有一本25章的书需要学习——是一个很常见的需求。
          </p>
          <p class="text-gray-700 mb-4">
            所以有了 Known Board.
          </p>
        </div>

        <div class="mt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">开源协议</h2>
          <p class="text-gray-700">
            MIT License
          </p>
        </div>
        
        <div class="mt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">作者博客 & 开源仓库</h2>
          <div class="flex flex-col [@media(min-width:440px)]:flex-row [@media(max-width:440px)]:max-w-45 gap-4">
            <a 
              href="https://www.elecmonkey.com/"
              target="_blank" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Elecmonkey的小花园
            </a>
            <a 
              href="https://github.com/elecmonkey/known-board"
              target="_blank" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              GitHub 项目仓库
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}