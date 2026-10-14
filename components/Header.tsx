"use client";
import { useState } from "react";
import Link from "next/link";
import type { Entry } from "contensis-delivery-api/lib/models";
import type { NavObj } from "@/app/layout";
import Icon from "./shared/Icon";
import ChevronDown from "./Icons/ChevronDown";
import Search from "./Icons/Search";
import styles from "./Header.module.css";

import NavPanel from "@/components/NavPanel";
import SearchPanel from "@/components/SearchPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  logo: Entry;
  navigation: NavObj;
  tasks: NavObj;
  searchUrl: string;
  queryParam: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

function Header({ logo, navigation, tasks, searchUrl, queryParam }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={` z-50 text-black relative  ${styles.mainHeader}`}>
      <div
        className={`mx-auto  max-w-(--page-max) px-7 2xl:px-2 relative flex justify-between items-center h-16 z-50 ${styles.headerTop} ${menuOpen || searchOpen ? styles.headerTopPanelOpen : ""}`}
      >
        <a
          id="header-logo"
          className={`${styles.logoLink} ${styles.headerLogo} focus-styles`}
          target="_self"
          href=""
        >
          <img loading="lazy" alt={logo.altText} src={logo.asset.sys.uri} />
        </a>

        <div className="flex">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`${styles.headerToolsToggle} ${menuOpen ? styles.headerToolsToggleOpen : ""}`}
            onClick={() => {
              setMenuOpen((o) => !o);
              setSearchOpen(false);
            }}
          >
            <Icon size="lg">
              <ChevronDown />
            </Icon>
            Menu
          </button>

          <div
            className={`${styles.headerToolsDivider} ${menuOpen || searchOpen ? styles.headerToolsDividerShow : ""}`}
          />

          <button
            aria-controls="site-search"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Close search" : "Open search"}
            className={`${styles.headerToolsToggle} ${searchOpen ? styles.headerToolsToggleOpen : ""}`}
            onClick={() => {
              setSearchOpen((o) => !o);
              setMenuOpen(false);
            }}
          >
            <Icon size="lg">
              <Search />
            </Icon>
            <span className="label visually-hidden">Open search</span>
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        className={`${styles.navPanel} ${menuOpen ? styles.navPanelOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <NavPanel
          className="mx-auto px-7 lg:px-2 max-w-(--page-max)"
          navigation={navigation}
          tasks={tasks}
        />
      </div>

      <div
        id="site-search"
        className={`${styles.navPanel} ${searchOpen ? styles.navPanelOpen : ""}`}
        aria-hidden={!searchOpen}
      >
        <SearchPanel
          searchUrl={searchUrl}
          queryParam={queryParam}
          popularTasks={tasks}
        />
      </div>
    </header>
  );
}

export default Header;
