"use client";
import { useEffect, useRef } from "react";
import { useNonce } from "@/components/NonceProvider";

type CustomCodeProps = {
  data: any;
};

function CustomCodeInjection({ data }: CustomCodeProps) {
  const nonce = useNonce();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = data.code;

    const originalScripts = Array.from(container.querySelectorAll("script"));

    // Split into external (has src) vs inline scripts, preserving order
    const externalScripts = originalScripts.filter((s) => s.src);
    const inlineScripts = originalScripts.filter((s) => !s.src);

    // Remove the inert originals; we'll insert executable replacements
    originalScripts.forEach((s) => s.remove());

    const runInlineScripts = () => {
      inlineScripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        newScript.setAttribute("nonce", nonce);
        newScript.textContent = oldScript.textContent;
        container.appendChild(newScript);
      });
    };

    if (externalScripts.length === 0) {
      // Nothing to wait for
      runInlineScripts();
      return;
    }

    let loadedCount = 0;
    externalScripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        // Skip inline event-handler attributes; CSP script-src-attr blocks them
        if (!attr.name.startsWith("on")) {
          newScript.setAttribute(attr.name, attr.value);
        }
      });
      newScript.setAttribute("nonce", nonce);
      newScript.addEventListener("load", () => {
        loadedCount += 1;
        if (loadedCount === externalScripts.length) {
          runInlineScripts();
        }
      });
      container.appendChild(newScript);
    });
  }, [data.code, nonce]);

  return (
    <section>
      <div ref={containerRef} suppressHydrationWarning />
    </section>
  );
}

export default CustomCodeInjection;
