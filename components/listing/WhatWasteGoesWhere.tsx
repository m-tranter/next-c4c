"use client";

import Accordion from "@/components/Accordion";
import Pagination from "@/components/listing/Pagination";
import { useListState } from "@/hooks/useListState";
import PageSizeSelector from "./PageSizeSelector";

import SearchInput from "@/components/listing/SearchInput";
import CategorySelect from "./CategorySelect";
import styles from "./Controls.module.css";

import { useRef } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";

type WhatWasteGoesWhereProps = {
  basePath?: string;
  data: {
    entries: Entry[];
    pageSize: number;
  };
};

/**
 * WhatWasteGoesWhere component for displaying waste item listings.
 * Renders entries as searchable accordion with pagination.
 * Uses the useListState hook for state management and CSS display for SEO-friendly page visibility.
 */
export default function WhatWasteGoesWhere({ data }: WhatWasteGoesWhereProps) {
  const scrollTo = useRef(null);
  const binOptions = data.entries.reduce((acc, e) => {
    e.binOption.forEach((cat: string) => {
      if (!acc.includes(cat)) {
        acc.push(cat);
      }
    });
    return acc;
  }, [] as string[]);
  binOptions.sort((a, b) => {
    return a.toLowerCase().includes("other")
      ? 1
      : b.toLowerCase().includes("other")
        ? -1
        : a.localeCompare(b, "en-GB");
  });

  type MyFilter = {
    [key: string]: string;
  };

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
  } = useListState<any, MyFilter>({
    data: data.entries,
    defaultPageSize: data.pageSize,
    defaultFilters: { binOption: "" },

    searchFn: (entry, query) => {
      return !query ? true : entry.searchContent.includes(query.toLowerCase());
    },

    filterFn: (entry, filters) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;

        if (Array.isArray(entry[key])) {
          if (!entry[key].includes(value)) return false;
        } else if (entry[key] !== value) {
          return false;
        }
      }
      return true;
    },
  });

  // Convert entries on current page to accordion items
  const accordionItems = currentPageEntries.map((entry, index) => {
    return {
      id: entry.sys?.id || `waste-${index}`,
      title: entry.entryTitle || entry.itemDescription || `Item ${index + 1}`,
      accordionContent: { __html: entry.solution || "" },
      binOption: entry.binOption,
    };
  });
  return (
    <div className="mb-6">
      <div className={`  ${styles.controls}`}>
        <div ref={scrollTo} className={` ${styles.facets}`}>
          <SearchInput
            $className={styles.facet}
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for an item..."
            ariaLabel="Search items"
          />

          <CategorySelect
            $className={styles.facet}
            cats={binOptions}
            onChange={setFilter}
            ariaLabel="Select bin type"
            placeholder="-- Bin type --"
          />
          <PageSizeSelector
            $className={styles.facet}
            pageSize={hookPageSize}
            onPageSizeChange={setPageSizeHook}
          />
        </div>
      </div>
      {/* SEO-friendly: all pages rendered, current page shown via CSS */}
      {[...Array(totalPages)].map((_, pageIdx) => (
        <div
          key={`page-${pageIdx}`}
          className={`listing__page${pageIdx === pageIndex ? " listing__page--active" : ""}`}
        >
          {pageIdx === pageIndex && accordionItems.length > 0 && (
            <Accordion data={{ items: accordionItems }} id="what-waste" />
          )}
          {pageIdx === pageIndex &&
            accordionItems.length === 0 &&
            total > 0 && <p>No items found.</p>}
        </div>
      ))}

      {total === 0 && <p>No items found.</p>}

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        scrollTo={scrollTo}
      />
    </div>
  );
}
