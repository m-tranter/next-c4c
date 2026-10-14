"use client";
import { useState } from "react";
import Container from "./shared/Container";
import Icon from "./shared/Icon";
import PillLink from "./shared/PillLink";
import Search from "./Icons/Search";
import styles from "./SearchPanel.module.css";
import type { NavObj } from "../app/layout";
// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  popularTasks: NavObj;
  searchUrl: string;
  queryParam: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

function SearchPanel({ popularTasks, searchUrl, queryParam }: Props) {
  const [query, setQuery] = useState("");

  const pills = popularTasks.links.map((task) => (
    <li key={task.sys.id}>
      <PillLink href={task.url || task.sys.uri || "/"}>
        {task.entryTitle}
      </PillLink>
    </li>
  ));

  return (
    <div className={`print:hidden ${styles.wrapper}`}>
      <Container>
        <form
          key="query"
          className={styles.searchForm}
          role="search"
          method="get"
          action={searchUrl}
        >
          <label htmlFor="search-panel__input" className={styles.searchLabel}>
            How can we help?
          </label>
          <div className={styles.searchFields}>
            <input
              type="search"
              id="search-panel__input"
              role="searchbox"
              name={queryParam}
              placeholder="Search"
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={styles.searchSubmit} type="submit">
              <Icon size="lg">
                <Search />
              </Icon>
              <span className="visually-hidden">Search</span>
            </button>
          </div>
        </form>

        {/* Popular tasks */}
        {pills.length > 0 && (
          <div className={styles.pillsGroup}>
            <h2 className="font-bold">Popular tasks</h2>
            <ul className="flex flex-wrap gap-2 list-none mt-0">{pills}</ul>
          </div>
        )}
      </Container>
    </div>
  );
}

export default SearchPanel;
