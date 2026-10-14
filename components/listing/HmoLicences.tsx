"use client";
import Table from "@/components/Table";

import styles from "./Controls.module.css";
import { useListState } from "@/hooks/useListState";
import Pagination from "@/components/listing/Pagination";
import { useRef } from "react";
import SearchInput from "@/components/listing/SearchInput";

import type { ListingProps } from "@/components/Canvas";

export default function HmoLicences({ data }: ListingProps) {
  const hmoLicences = data.entries;
  const scrollTo = useRef(null);

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
    data: hmoLicences,
    defaultPageSize: 10,

    searchFn: (entry, query) => {
      if (!query) return true;
      const search = query.toLowerCase();
      return entry.searchContent.includes(search);
    },

    filterFn: (entry, filters) => {
      // Keep this if you plan to use filters later
      for (const [key, value] of Object.entries(filters)) {
        if (value && entry[key] !== value) return false;
      }
      return true;
    },
  });

  const rows = currentPageEntries.map((e) => {
    return (
      <tr key={e.sys.id}>
        <td>{e.licenceReference}</td>
        <td>{e.buildingName}</td>
        <td>{e.area}</td>
        <td>{e.postcode}</td>
        <td>{e.dateStr}</td>
      </tr>
    );
  });

  const headers = (
    <>
      <th scope="col">Licence reference</th>
      <th scope="col">Building name or number and street</th>
      <th scope="col">Area</th>
      <th scope="col">Postcode</th>
      <th scope="col">Licence expiry date</th>
    </>
  );

  return (
    <div className="breakout">
      <div ref={scrollTo} className={styles.facets}>
        <SearchInput
          $className={styles.facet}
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search for an item..."
          ariaLabel="Search items"
        />
      </div>
      {rows.length ? (
        <Table
          $className="my-5"
          caption="HMO licences"
          ths={headers}
          rows={rows}
        />
      ) : (
        <p className="mt-5">
          <strong>No results. Try clearing search</strong>
        </p>
      )}

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        scrollTo={scrollTo}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
