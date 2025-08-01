import type { Component } from 'solid-js';

interface IconProps {
  class?: string;
}

const AddIcon: Component<IconProps> = (props) => {
  return (
    <svg class={props.class || 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
  );
};

export default AddIcon;