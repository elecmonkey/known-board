import { A, useLocation } from '@solidjs/router';
import { createSignal, onMount, onCleanup } from 'solid-js';

export default function Navigation() {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = createSignal({ width: 0, left: 0 });
  const [desktopIndicatorStyle, setDesktopIndicatorStyle] = createSignal({ width: 0, left: 0 });
  let indicatorRefs: (HTMLAnchorElement | undefined)[] = [];
  let desktopIndicatorRefs: (HTMLAnchorElement | undefined)[] = [];

  const navItems = [
    { path: '/', label: '待办', icon: '📋' },
    { path: '/completed', label: '已完成', icon: '✅' },
    { path: '/all', label: '所有任务', icon: '📚' }
  ];

  const updateIndicatorPosition = () => {
    // 移动端指示器
    const mobileActiveIndex = navItems.findIndex(item => item.path === location.pathname);
    if (mobileActiveIndex !== -1 && indicatorRefs[mobileActiveIndex]) {
      const element = indicatorRefs[mobileActiveIndex]!;
      setIndicatorStyle({
        width: element.offsetWidth,
        left: element.offsetLeft
      });
    } else {
      // 如果不在导航项中，隐藏指示器
      setIndicatorStyle({ width: 0, left: 0 });
    }

    // 桌面端指示器
    const desktopActiveIndex = navItems.findIndex(item => item.path === location.pathname);
    if (desktopActiveIndex !== -1 && desktopIndicatorRefs[desktopActiveIndex]) {
      const element = desktopIndicatorRefs[desktopActiveIndex]!;
      setDesktopIndicatorStyle({
        width: element.offsetWidth,
        left: element.offsetLeft
      });
    } else {
      // 如果不在导航项中，隐藏指示器
      setDesktopIndicatorStyle({ width: 0, left: 0 });
    }
  };

  // 监听路由变化
  onMount(() => {
    // 初始位置更新
    setTimeout(updateIndicatorPosition, 0);
    
    // 使用MutationObserver监听路由变化
    const observer = new MutationObserver(updateIndicatorPosition);
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);
    
    // 窗口大小变化时更新
    window.addEventListener('resize', updateIndicatorPosition);
    
    // 清理
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicatorPosition);
    });
  });

  return (
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 移动端两行布局 */}
        <div class="sm:hidden">
          <div class="flex justify-center py-3">
            <h1 class="text-xl font-bold text-gray-900">Known Board 网课看板</h1>
          </div>
          <div class="flex border-t border-gray-200 relative">
            {/* 滑动指示器 */}
            <div 
              class="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out"
              style={{
                width: `${indicatorStyle().width}px`,
                left: `${indicatorStyle().left}px`
              }}
            ></div>
            {navItems.map((item, index) => (
              <A
                href={item.path}
                class={`flex-1 text-center py-3 text-sm font-medium transition-colors relative z-10 ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                ref={el => indicatorRefs[index] = el}
              >
                <span class="flex flex-col items-center">
                  <span class="text-base">{item.icon}</span>
                  <span class="mt-1">{item.label}</span>
                </span>
              </A>
            ))}
          </div>
        </div>

        {/* 桌面端单行布局 */}
        <div class="hidden sm:flex justify-between h-16 relative">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Known Board 网课看板</h1>
          </div>
          <div class="flex items-center">
            <div class="flex space-x-1">
              {/* 滑动指示器 */}
              <div 
                class="absolute bottom-0 h-0.5 bg-blue-500 rounded-t transition-all duration-300 ease-in-out"
                style={{
                  width: `${desktopIndicatorStyle().width}px`,
                  left: `${desktopIndicatorStyle().left}px`
                }}
              ></div>
              {navItems.map((item, index) => (
                <A
                  href={item.path}
                  class={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative flex items-center h-full ${
                    location.pathname === item.path
                      ? 'text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  ref={el => desktopIndicatorRefs[index] = el}
                >
                  <span class="mr-2">{item.icon}</span>
                  {item.label}
                </A>
              ))}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}