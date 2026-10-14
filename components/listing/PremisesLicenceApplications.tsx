"use client";

import { useListState } from "@/hooks/useListState";
import SearchInput from "@/components/listing/SearchInput";

import styles from "./Controls.module.css";

import { Fragment, useRef } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import { formatDate } from "@/lib/helpers";
import LicensingAddress from "../shared/LicensingAddress";
import type { ListingProps } from "@/components/Canvas";

export default function PremisesLicenceApplications({ data }: ListingProps) {
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

  return (
    <>
      <h2>Premises licence applications</h2>
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
      </div>

      {currentPageEntries.length === 0 ? (
        <p v-if="!page.pages[0].length">No results found.</p>
      ) : (
        currentPageEntries.map((item) => {
          const first = item.introductoryParagraph
            .split(" ")
            .shift()
            .toUpperCase();
          return (
            <Fragment key={item.sys.id}>
              <hr />
              <h2>{item.nameAndAddress}</h2>
              <p>
                <strong>{item.typeOfApplication.toUpperCase()}</strong>
              </p>
              <p>
                <strong>{first}</strong>
                {item.introductoryParagraph.slice(first.length)}
              </p>
              <ul>
                {item.licencesOrVariationsAppliedFor.map((elem: string) => {
                  return <li key={elem}>{elem}</li>;
                })}
              </ul>
              <p>
                Representations shall be made in writing to the below address on
                or before the following date:
                {` ${formatDate(item.lastDateForRepresentations)}`}.
              </p>
              <LicensingAddress />
            </Fragment>
          );
        })
      )}
    </>
  );
}
