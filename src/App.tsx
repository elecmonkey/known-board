import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { AppProvider } from './store';
import Layout from './components/Layout';
import PendingPage from './pages/PendingPage';
import CompletedPage from './pages/CompletedPage';
import AllTasksPage from './pages/AllTasksPage';
import AboutPage from './pages/AboutPage';

const App: Component = () => {
  return (
    <AppProvider>
      <Router root={Layout}>
        <Route path="/" component={PendingPage} />
        <Route path="/completed" component={CompletedPage} />
        <Route path="/all" component={AllTasksPage} />
        <Route path="/about" component={AboutPage} />
      </Router>
    </AppProvider>
  );
};

export default App;