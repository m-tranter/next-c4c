interface MinusIconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  state?: number;
}

function MinusIcon({ className = '', color = 'currentColor', width = 24, height = 24, state }: MinusIconProps) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ color }}
    >
      <path fill="currentColor" d="M19 13H5v-2h14v2Z"></path>
    </svg>
  );
}

export default MinusIcon;