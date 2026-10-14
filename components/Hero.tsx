"use client";
import Link from "next/link";
import Heading from "./shared/Heading";
import Icon from "./shared/Icon";
import ChevronRight from "./Icons/ChevronRight";
import HeroImage from "./HeroImage";
import type { Asset } from "@/lib/seo";
import styles from "./Hero.module.css";
import { usePathname } from "next/navigation";

type Props = {
  entryTitle: string;
  description?: string;
  breadcrumbs?: Record<string, any>[];
  heroImage?: Asset;
};

const senCase = (str: string) => {
  if (!str) {
    return;
  } else {
    return str[0].toUpperCase() + str.slice(1).replace(/-/g, " ");
  }
};

function Hero({ entryTitle, description, breadcrumbs = [], heroImage }: Props) {
  const pathName = usePathname();
  const pathSplit = pathName.split("/");

  let localBreadcrumbs = [...breadcrumbs];
  if (pathSplit.length > breadcrumbs.length) {
    localBreadcrumbs = pathSplit.slice(breadcrumbs.length).reduce((acc, e) => {
      let lastPath = acc.length ? acc[acc.length - 1].path : "/";
      return [...acc, { path: `${lastPath}/${e}`, displayName: senCase(e) }];
    }, breadcrumbs);
  }

  const crumbs = localBreadcrumbs.map((crumb, i) => {
    const isLast = i === localBreadcrumbs.length - 1;
    const href = crumb?.path || "/";
    const className =
      "text-(--color-text,#212529) underline underline-offset-2 py-2.5 min-w-11 hover:text-(--color-text,#212529)";

    return (
      <li
        className={`flex items-center gap-1 ${styles["breadcrumb-item"]} `}
        key={`${crumb.path}_${i}`}
      >
        {i > breadcrumbs.length ? (
          <Link className={className} href={href} prefetch={false}>
            {crumb.displayName || "Home"}
          </Link>
        ) : (
          <a className={className} href={href}>
            {crumb.displayName || "Home"}
          </a>
        )}
        {!isLast && (
          <Icon size="sm">
            <ChevronRight />
          </Icon>
        )}
      </li>
    );
  });

  return (
    <div className={`bg-(--color-bg) ${styles.wrapper}`}>
      {heroImage && <HeroImage heroImage={heroImage} />}
      <div
        className={`${styles.heroContent} mx-auto max-w-(--page-max) px-7 2xl:px-2`}
      >
        {crumbs.length > 0 && (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ul
              className={`flex flex-nowrap gap-2 list-none text-sm md:text-base leading-6  font-(--font-body) ${styles["breadcrumb-list"]}`}
            >
              {crumbs}
            </ul>
          </nav>
        )}
        <Heading size="h1" as="h1" id="page-content" className={styles.heading}>
          {entryTitle}
        </Heading>
        {description && (
          <p
            className={`mt-3 leading-8 font-bold  font-(--font-heading) ${styles.heroContentDescription}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default Hero;
