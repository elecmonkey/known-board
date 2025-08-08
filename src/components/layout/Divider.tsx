interface DividerProps {
  class?: string;
}

export default function Divider(props: DividerProps) {
  return (
    <div 
      class="border-b border-gray-200" 
      classList={{ 
        [props.class || '']: true 
      }}
    ></div>
  );
}