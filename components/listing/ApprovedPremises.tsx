"use client";

import Accordion from "@/components/Accordion";
import { useListState } from "@/hooks/useListState";
import SearchInput from "@/components/listing/SearchInput";
import styles from "./Controls.module.css";
import styles2 from "./ApprovedPremises.module.css";

import { useRef } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import type { ListingProps } from "@/components/Canvas";

export default function ApprovedPremises({ data }: ListingProps) {
  const scrollTo = useRef(null);

  // Use the useListState hook with our mock fetch function
  const {
    data: currentPageEntries,
    total,
    totalPages,
    query: searchTerm,
    setQuery: setSearchTerm,
    pageIndex,
    filters,
    setFilter,
    setPageIndex,
    pageSize: hookPageSize,
    setPageSize: setPageSizeHook,
  } = useListState({
    data: data.entries,
    defaultPageSize: 1000,

    searchFn: (entry, query) => {
      if (!query) return true;
      const search = query.toLowerCase();
      const title = entry.entryTitle?.toLowerCase() || "";
      const item = entry.item?.toLowerCase() || "";
      const keywords = entry.keywords?.toLowerCase() || "";
      return (
        title.includes(search) ||
        item.includes(search) ||
        keywords.includes(search)
      );
    },

    filterFn: (entry, filters) => {
      // Keep this if you plan to use filters later
      for (const [key, value] of Object.entries(filters)) {
        if (value && entry[key] !== value) return false;
      }
      return true;
    },
  });

  const makeAcc = (e: Entry) => {
    return `
    <h3 class="pt-3">
      <strong>${e.entryTitle}</strong>
    </h3>
    ${e.address}
    <p>Phone: ${e.telephone}</p>
    <p>Website: <a href="${e.url}">${e.entryTitle}</a></p>
    `;
  };

  //
  const currentTowns = currentPageEntries.reduce((acc: string[], e: Entry) => {
    return acc.includes(e.town) ? acc : [...acc, e.town];
  }, []);

  currentTowns.sort();

  const accordionItems: any[] = currentTowns.map((t: string, index) => {
    return {
      id: `prem-${index}`,
      title: t,
      accordionContent: {
        __html: currentPageEntries
          .filter((e) => e.town.toLowerCase().trim() === t.toLowerCase().trim())
          .map(makeAcc)
          .join(""),
      },
    };
  });

  return (
    <div className="my-6">
      <div className={` ${styles.controls}`}>
        <div ref={scrollTo} className={` ${styles.facets}`}>
          <SearchInput
            $className={styles.facet}
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for an item..."
            ariaLabel="Search items"
          />
        </div>
      </div>

      <div className={`${styles2.premAddress} listing__page `}>
        <Accordion data={{ items: accordionItems }} id="approved-prems" />
      </div>
    </div>
  );
}
