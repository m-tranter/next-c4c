import styles from "./Heading.module.css";
import React from "react";

type Size = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";

type Props = {
  size?: Size;
  as?: As;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

function Heading({ size = "h3", as, id, className = "", children }: Props) {
  const Tag = (as ?? size) as keyof React.JSX.IntrinsicElements;
  return (
    <Tag id={id} className={`${styles[size]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export default Heading;
