interface PlusIconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  state?: number;
}

function PlusIcon({ className = '', color = 'currentColor', width = 24, height = 24, state }: PlusIconProps) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ color }}
    >
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"></path>
    </svg>
  );
}

export default PlusIcon;