interface ChevronDownProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  state?: number;
}

function ChevronDown({ className = '', color = 'currentColor', width = 24, height = 24, state }: ChevronDownProps) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default ChevronDown;