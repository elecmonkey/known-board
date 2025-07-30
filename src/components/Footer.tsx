import { A } from '@solidjs/router';

export default function Footer() {
  return (
    <footer class="bg-white border-t border-gray-200 py-4 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500">
            © {new Date().getFullYear()} Known Board. All rights reserved.
          </div>
          <div class="flex items-center space-x-4 mt-2 md:mt-0">
            <span class="text-sm text-gray-500">Author: Elecmonkey</span>
            <A 
              href="/about" 
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              关于
            </A>
          </div>
        </div>
      </div>
    </footer>
  );
}