import Link from "next/link";
import Icon from "@/components/shared/Icon";
import ArrowDown from "./Icons/ArrowDown";
import styles from "./Skip.module.css";

const SkipToMainContent = () => {
  return (
    <Link
      className={`absolute mt-0 w-px h-px m-0 overflow-hidden whitespace-nowrap leading-6 font-normal  inline-flex items-center gap-2 no-underline
focus:static focus:w-auto focus:h-auto focus:overflow-visible focus:underline
        ${styles.skip}`}
      href="#main"
    >
      <Icon size="xs">
        <ArrowDown />
      </Icon>
      Skip to main content
    </Link>
  );
};
export default SkipToMainContent;
