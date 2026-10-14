// ChevronLeft icon for pagination
interface ChevronLeftProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  state?: number;
}

function ChevronLeft({ className = '', color = 'currentColor', width = 24, height = 24, state }: ChevronLeftProps) {
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
      <path d="M16 7.4866L11.1771 12L16 16.5134L14.4115 18L8 12L14.4115 6L16 7.4866Z" fill="currentColor"></path>
    </svg>
  );
};

export default ChevronLeft;