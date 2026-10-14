"use client";

import { useRef, RefObject, ReactElement, Ref } from "react";
import Icon from "./shared/Icon";
import Facebook from "./Icons/Facebook";
import LinkedIn from "./Icons/LinkedIn";
import MailIcon from "./Icons/MailIcon";
import YouTube from "./Icons/YouTube";
import Share from "./Icons/Share";
import styles from "./SharePage.module.css";
type Props = {
  url: string;
  description: string;
  title: string;
};

const ICONS: Record<string, ReactElement> = {
  Share: <Share />,
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
  Email: <MailIcon />,
  YouTube: <YouTube />,
};

const shareUrl = async (
  title: string,
  description: string,
  url: string,
  dialog: RefObject<HTMLDialogElement | null>,
) => {
  const shareData = {
    title,
    text: description,
    url,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err);
    }
  } else {
    navigator.clipboard.writeText(url);
    if (dialog.current) {
      dialog.current.showModal();
    }
  }
};

const links = ["Share", "Facebook", "LinkedIn", "Email"];
function getShareHref(type: string, url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (type) {
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "X":
      return `https://x.com/intent/post?text=${t}&url=${u}`;
    case "LinkedIn":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "Email":
      return `mailto:?subject=${t}&body=${u}`;
  }
}

const closeDialog = (d: RefObject<HTMLDialogElement | null>) => {
  d?.current?.close();
};

function SharePage({ url = "", title = "", description }: Props) {
  const dialogRef = useRef(null);
  return (
    <div className=" mx-auto w-full mt-5 px-5 2xl:px-0 py-6 border-t border-(--color-border,#222256) print:hidden">
      <p className="text-sm md:text-base leading-6 font-normal font-sans text-(--color-title-link) mb-3">
        Share this page
      </p>
      <nav aria-label="Share this page">
        <ul className="flex flex-wrap gap-6 justify-center md:justify-start list-none p-0 m-0">
          {links.map((type) => (
            <li key={type}>
              {type === "Share" ? (
                <a
                  onClick={() => shareUrl(title, description, url, dialogRef)}
                  className="inline-grid place-items-center w-11 h-11 aspect-square rounded-full p-3 bg-[#f2eff8] text-[#0b0c0c] no-underline transition-all duration-200 ease-in-out hover:bg-[#d5cce8] hover:text-[#212529] focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-bg,#fff),0_0_0_5px_var(--color-text,#212529)] text-sm md:text-base leading-6 font-normal font-sans"
                >
                  <Icon size="md">{ICONS[type]}</Icon>
                  <span className="sr-only">{type}</span>
                </a>
              ) : (
                <a
                  className="inline-grid place-items-center w-11 h-11 aspect-square rounded-full p-3 bg-[#f2eff8] text-[#0b0c0c] no-underline transition-all duration-200 ease-in-out hover:bg-[#d5cce8] hover:text-[#212529] focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-bg,#fff),0_0_0_5px_var(--color-text,#212529)] text-sm md:text-base leading-6 font-normal font-sans"
                  href={getShareHref(type, url, title)}
                  target={type === "email" ? undefined : "_blank"}
                  rel={type === "email" ? undefined : "noopener noreferrer"}
                  aria-label={`Share on ${type}`}
                >
                  <Icon size="md">{ICONS[type]}</Icon>
                  <span className="sr-only">{type}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <dialog className={styles.myModal} ref={dialogRef}>
        <p>The link was copied to the clipboard.</p>
        <button onClick={() => closeDialog(dialogRef)}>Close</button>
      </dialog>
    </div>
  );
}

export default SharePage;
