
interface ChevronRightProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  state?: number;
}

function ChevronRight({ className = '', color = 'currentColor', width = 24, height = 24, state }: ChevronRightProps) {
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
      <path d="M8 7.4866L12.8229 12L8 16.5134L9.58854 18L16 12L9.58854 6L8 7.4866Z" fill="currentColor"></path>
    </svg>
  )
};

export default ChevronRight
