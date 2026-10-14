import React from "react";
import NextLink from "next/link";
import type { MouseEvent, ReactNode } from "react";

export type LinkProps = {
  path?: string;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  download?: string;
  openInNewWindow?: boolean;
  className?: string;
};

type LinkElement = HTMLSpanElement & HTMLAnchorElement;

/**
 * A custom link component that handles internal and external links.
 * Uses Next.js Link for internal routes, anchor for external.
 */
const Link = React.forwardRef<LinkElement, LinkProps>((props, forwardedRef) => {
  const {
    path,
    children,
    onClick,
    download,
    openInNewWindow,
    className = "",
  } = props;

  /**
   * If no path is provided, render a span element
   */
  if (!path) {
    return (
      <span
        className={`link link--no-path ${className ? className : ""}`}
        ref={forwardedRef}
      >
        {children}
      </span>
    );
  }

  /**
   * Determine whether to open the link in a new window/tab
   */
  const target = openInNewWindow ? "_blank" : "_self";

  /**
   * Encode the path URI
   */
  const encodedPath = encodeURI(path);

  /**
   * Event handler for click event
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Check if internal route (starts with '/' and not an external protocol)
  const isInternal = path.startsWith("/") && !path.startsWith("//");

  if (isInternal && target === "_self") {
    /**
     * If the link is an internal route, render a Next.js Link component
     */
    return (
      <NextLink
        href={encodedPath}
        onClick={handleClick}
        download={download}
        className={`link ${className ? className : ""}`}
        ref={forwardedRef}
      >
        {children}
      </NextLink>
    );
  } else {
    /**
     * If the link is an external URL, render an anchor element <a>
     */
    return (
      <a
        href={encodedPath}
        onClick={handleClick}
        target={target}
        download={download}
        className={`link link--external ${className ? className : ""}`}
        ref={forwardedRef}
      >
        {children}
        {target === "_blank" && (
          <span className="sr-only">(opens in new tab)</span>
        )}
      </a>
    );
  }
});
Link.displayName = "Link";

export default Link;
