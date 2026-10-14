import { ReactNode } from "react";
import styles from "./Container.module.css";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}
export default function Container({ fullWidth, children, className }: Props) {
  return (
    <div
      className={`${styles.container} ${className ? className : ""} mx-auto w-full col-start-1 col-end-13 ${fullWidth ? "" : " lg:col-end-8"}  `}
    >
      {children}
    </div>
  );
}
