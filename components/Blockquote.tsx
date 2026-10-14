import React from "react";
// import styles from "./Icon.module.css";
import Icon from "./shared/Icon";
type Props = {
  children: React.ReactNode;
};

const Blockquote = ({ children }: Props) => {
  return <blockquote>{children}</blockquote>;
};
export default Blockquote;
