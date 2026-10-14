import styles from "./Icon.module.css";

interface Props {
  size: string;
  className?: string;
  children?: React.ReactNode;
}
const Icon = ({ children, size, className }: Props) => {
  return (
    <span
      aria-hidden="true"
      role="img"
      className={`${className} inline-block shrink-0 ${styles.icon} ${styles[size]}`}
    >
      {children}
    </span>
  );
};

export default Icon;
