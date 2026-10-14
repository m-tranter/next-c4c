import { useCallback, useEffect, useRef, useState } from "react";

export function useOverflow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [overflows, setOverflows] = useState(false);

  const check = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;

    setOverflows(
      imageRef.current.clientHeight < containerRef.current.scrollHeight,
    );
  }, []);

  useEffect(() => {
    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [check]);

  return {
    containerRef,
    imageRef,
    overflows,
    checkOverflow: check,
  };
}
