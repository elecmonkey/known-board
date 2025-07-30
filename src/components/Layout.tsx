import { JSX } from 'solid-js';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children?: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen flex flex-col">
      <Navigation />
      <main class="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}