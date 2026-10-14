"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Election.module.css";

type RelatedPagesProps = {
  election: string;
  basePath: string;
};

export default function ElectionNav({ election, basePath }: RelatedPagesProps) {
  const pathname = usePathname();
  const electionPath = `${basePath}/elections-dashboard/${election}`;

  const links = [
    { href: electionPath, label: "Overview" },
    { href: `${electionPath}/wards`, label: "Results by ward" },
    { href: `${electionPath}/parties`, label: "Results by party" },
    { href: `${electionPath}/councillors`, label: "Councillors" },
    { href: `${electionPath}/slideshow`, label: "Slideshow", alwaysShow: true },
  ];

  const visibleLinks = links.filter(
    (link) => link.alwaysShow || pathname !== link.href,
  );

  return (
    <>
      <h2 className="text-2xl font-semibold">Related pages</h2>
      <ul className={styles.navigation}>
        {visibleLinks.map((link) => (
          <li className="list-none " key={link.href}>
            <Link href={link.href} className="text-blue-600 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
