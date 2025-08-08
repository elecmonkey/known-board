// TypeScript declarations for solid-dnd directives
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggable: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      droppable: any;
    }
  }
}

export {};