"use client";
import Table from "@/components/Table";
import type { Entry } from "contensis-delivery-api/lib/models";

import styles from "./Controls.module.css";
import { useListState } from "@/hooks/useListState";
import Pagination from "@/components/listing/Pagination";
import { useRef } from "react";
import SearchInput from "@/components/listing/SearchInput";

import type { ListingProps } from "@/components/Canvas";
interface Link {
  target: string;
  label: string;
}

export default function CouncilConsultations({ data }: ListingProps) {
  const today = new Date();
  const scrollTo = useRef(null);

  const pastConsultations = data.entries.filter(
    (e) =>
      !e.date ||
      (e.date &&
        e.date < today &&
        (e.displayWithoutResultsDocument || e.resultLink[0])),
  );

  pastConsultations.sort((a, b) => b.date - a.date);

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
    data: pastConsultations,
    defaultPageSize: 10,

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

  const rows = currentPageEntries.map((e) => {
    return (
      <tr key={e.sys.id}>
        <td>
          <p className="my-0">{e.title}</p>
          {e.consultationCode && <p className="my-0">({e.consultationCode})</p>}
        </td>
        <td>{e.dateStr && <span>{e.dateStr}</span>}</td>
        <td>
          {e.resultLink.length ? (
            <ul className="list-none!">
              {e.resultLink.map((l: Link) => (
                <li key={l.target}>
                  <a href={l.target}>{l.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Results pending.</p>
          )}
        </td>
        <td>
          {e.outcomeLinks && (
            <ul className="list-none!">
              {e.outcomeLinks.map((l: Link) => (
                <li key={l.target}>
                  <a href={l.target}>{l.label}</a>
                </li>
              ))}
            </ul>
          )}
        </td>
      </tr>
    );
  });

  const headers = (
    <>
      <th scope="col">Consultation</th>
      <th scope="col">End date</th>
      <th scope="col">Results documents</th>
      <th scope="col">Outcomes</th>
    </>
  );

  return (
    <div className="full-bleed">
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
            caption="Council consultation results"
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
    </div>
  );
}
