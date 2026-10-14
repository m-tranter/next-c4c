interface ArrowDownProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export default function ArrowDown({
  className = '',
  color = 'currentColor',
  width = 24,
  height = 24,
}: ArrowDownProps) {
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
      <path
        fill="currentColor"
        d="M23.29 10.24a1.4 1.4 0 0 0-2 .13l-7.45 8.46a.25.25 0 0 1-.394-.022.26.26 0 0 1-.046-.138V1.41a1.41 1.41 0 0 0-2.82 0v17.26a.26.26 0 0 1-.16.23.25.25 0 0 1-.28-.07L2.7 10.37a1.41 1.41 0 0 0-2.12 1.86l9.65 11a2.36 2.36 0 0 0 3.54 0l9.65-11a1.412 1.412 0 0 0-.13-1.99Z"
      ></path>
    </svg>
  );
}
