export async function startPreload() {
  const manifest = (window as any).__PREFETCH_MANIFEST__;
  if (!manifest) return;

  setTimeout(() => {
    manifest.high.forEach((fileName: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/${fileName}`;
      document.head.appendChild(link);
    });
  }, 500);

  setTimeout(() => {
    manifest.medium.forEach((fileName: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/${fileName}`;
      document.head.appendChild(link);
    });
  }, 800);

  setTimeout(() => {
    manifest.low.forEach((fileName: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/${fileName}`;
      document.head.appendChild(link);
    });
  }, 1200);
}