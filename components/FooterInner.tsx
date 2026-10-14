import Link from "next/link";
import type { Entry } from "contensis-delivery-api/lib/models";
import styles from "./FooterInner.module.css";
import Pinterest from "./Icons/Pinterest";
import Spotify from "./Icons/Spotify";
import BlueSky from "./Icons/BlueSky";
import TikTok from "./Icons/TikTok";
import Facebook from "./Icons/Facebook";
import Instagram from "./Icons/Instagram";
import LinkedIn from "./Icons/LinkedIn";
import XDotCom from "./Icons/XDotCom";
import YouTube from "./Icons/YouTube";
import Icon from "@/components/shared/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  logo: Entry;
  social: Array<any>;
  navigation: Array<any>;
};

// ─── Icon map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ReactNode> = {
  X: <XDotCom />,
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
  Instagram: <Instagram />,
  Pinterest: <Pinterest />,
  TikTok: <TikTok />,
  Spotify: <Spotify />,
  BlueSky: <BlueSky />,
  YouTube: <YouTube />,
};

// ─── Component ────────────────────────────────────────────────────────────────

function FooterInner({ logo, social, navigation }: Props) {
  social.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
  const socialLinks = social.map((sl) => (
    <li key={sl.type}>
      <a
        className={styles.socialLink}
        target={sl.openInNewTab ? "_blank" : "_self"}
        href={sl.url || sl.sys?.uri}
        rel={sl.openInNewTab ? "noopener noreferrer" : undefined}
      >
        <Icon size="md">{iconMap[sl.type] ?? null}</Icon>
        <span className="visually-hidden">{sl.title}</span>
      </a>
    </li>
  ));

  const navigationLinks = navigation.map((l) => (
    <li className={styles.footerLinksItem} key={l.sys?.id ?? l.url}>
      <Link
        className={styles.footerLink}
        target="_self"
        href={l.url || l.sys?.uri || "/"}
      >
        {l.entryTitle}
      </Link>
    </li>
  ));

  return (
    <div className={styles.footerInner}>
      {/* Brand column: logo + social icons */}
      <div className={styles.footerColumnBrand}>
        <a id="footerLogo" className={styles.logoLink} href="/">
          <img
            height="70"
            width="155"
            alt={logo.altText}
            src={logo.asset?.sys?.uri}
            className={styles.logoImg}
          />
        </a>
        <nav aria-label="Links to our social media profiles">
          <ul className={styles.socialLinks}>{socialLinks}</ul>
        </nav>
      </div>

      {/* Navigation column */}
      <div className={styles.footerColumnNavigation}>
        <nav aria-label="Main footer navigation">
          <ul className={styles.footerLinks}>{navigationLinks}</ul>
        </nav>
      </div>
    </div>
  );
}

export default FooterInner;
