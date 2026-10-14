"use client";
import Icon from "@/components/shared/Icon";
import ChevronUp from "./Icons/ChevronUp";
import { useState, useEffect } from "react";
import styles from "./BackToTop.module.css";

function BackToTop({ threshold = 400 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className={`${styles.backToTop} ${visible ? "" : styles.hidden}`}>
        <button
          title="Back to top"
          type="button"
          className={styles.button}
          aria-label="Back to top"
          aria-expanded={visible}
          onClick={scrollToTop}
        >
          <Icon size="lg">
            <ChevronUp />
          </Icon>
          <span className={styles.label}>Back to top</span>
        </button>
      </div>
    </div>
  );
}

export default BackToTop;
