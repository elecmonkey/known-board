import type { Component } from 'solid-js';

interface IconProps {
  class?: string;
}

const EditIcon: Component<IconProps> = (props) => {
  return (
    <svg class={props.class || 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
    </svg>
  );
};

export default EditIcon;