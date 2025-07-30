import { JSX } from 'solid-js';
import Navigation from './Navigation';

interface LayoutProps {
  children?: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen bg-gray-50">
      <Navigation />
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}