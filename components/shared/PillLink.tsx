import Link from "next/link";
import styles from "./PillLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const PillLink = ({ href, children, className = "" }: Props) => (
  <Link href={href} className={`${styles.link} ${className}`.trim()}>
    {children}
  </Link>
);

export default PillLink;
