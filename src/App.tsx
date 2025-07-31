import type { Component } from 'solid-js';
import { lazy, onMount } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { AppProvider } from './store';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import { preloadAllPages } from './routes-preload';

const PendingPage = lazy(() => import('./pages/PendingPage'));
const CompletedPage = lazy(() => import('./pages/CompletedPage'));
const AllTasksPage = lazy(() => import('./pages/AllTasksPage'));
const SortPage = lazy(() => import('./pages/SortPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));

const App: Component = () => {
  onMount(() => {
    setTimeout(() => {
      // 排除首屏页面 PendingPage.tsx
      preloadAllPages('PendingPage.tsx');
    }, 500);
  });

  return (
    <AppProvider>
      <ToastProvider>
        <Router root={Layout}>
          <Route path="/" component={PendingPage} />
          <Route path="/completed" component={CompletedPage} />
          <Route path="/all" component={AllTasksPage} />
          <Route path="/sort" component={SortPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/guide" component={GuidePage} />
        </Router>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;