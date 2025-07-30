import { A } from '@solidjs/router';

export default function AboutPage() {
  return (
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">关于</h1>
        
        <div class="prose prose-gray max-w-none">
          <p class="text-gray-700 mb-4">
            Known Board
          </p>
        </div>
        
        <div class="mt-8">
          <A 
            href="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </A>
        </div>
      </div>
    </div>
  );
}