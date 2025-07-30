import { A, useLocation } from '@solidjs/router';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '待办', icon: '📋' },
    { path: '/completed', label: '已完成', icon: '✅' },
    { path: '/all', label: '所有任务', icon: '📚' }
  ];

  return (
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 移动端两行布局 */}
        <div class="sm:hidden">
          <div class="flex justify-center py-3">
            <h1 class="text-xl font-bold text-gray-900">Known Board</h1>
          </div>
          <div class="flex border-t border-gray-200">
            {navItems.map((item, index) => (
              <A
                href={item.path}
                class={`flex-1 text-center py-3 text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span class="flex flex-col items-center">
                  <span class="text-base">{item.icon}</span>
                  <span class="mt-1">{item.label}</span>
                </span>
                {location.pathname === item.path && (
                  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </A>
            ))}
          </div>
        </div>

        {/* 桌面端单行布局 */}
        <div class="hidden sm:flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Known Board</h1>
          </div>
          <div class="flex space-x-1">
            {navItems.map(item => (
              <A
                href={item.path}
                class={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span class="mr-2">{item.icon}</span>
                {item.label}
                {location.pathname === item.path && (
                  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t"></div>
                )}
              </A>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}