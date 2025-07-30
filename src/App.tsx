import type { Component } from 'solid-js';
import { lazy } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { AppProvider } from './store';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';

const PendingPage = lazy(() => import('./pages/PendingPage'));
const CompletedPage = lazy(() => import('./pages/CompletedPage'));
const AllTasksPage = lazy(() => import('./pages/AllTasksPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const App: Component = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <Router root={Layout}>
          <Route path="/" component={PendingPage} />
          <Route path="/completed" component={CompletedPage} />
          <Route path="/all" component={AllTasksPage} />
          <Route path="/about" component={AboutPage} />
        </Router>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;