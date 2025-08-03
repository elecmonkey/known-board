interface VideoUrlInputProps {
  id: string;
  name: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
}

export default function VideoUrlInput(props: VideoUrlInputProps) {
  const handleInput = (rawValue: string) => {
    let processedValue = rawValue.trim();
    // 只有在有内容的情况下才添加http://前缀
    if (processedValue && !processedValue.startsWith('http')) {
      processedValue = 'http://' + processedValue;
    }
    props.onInput(processedValue);
  };

  return (
    <input
      type="text"
      id={props.id}
      name={props.name}
      value={props.value}
      onInput={(e) => handleInput(e.target.value)}
      class="w-full px-2 py-1 border border-gray-300 rounded"
      placeholder={props.placeholder || "学习资源链接（可选）"}
    />
  );
}