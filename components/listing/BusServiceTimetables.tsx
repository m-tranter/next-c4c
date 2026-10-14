"use client";

import type { Entry } from "contensis-delivery-api/lib/models";

import Pagination from "@/components/listing/Pagination";
import { useListState } from "@/hooks/useListState";
import { useRef, Fragment } from "react";
import tableStyles from "./VenuesForHire.module.css";
import styles from "./Controls.module.css";
import SearchInput from "@/components/listing/SearchInput";
import type { ListingProps } from "@/components/Canvas";

type MyFilter = {
  [key: string]: string;
};
function BusServiceTimetables({ data }: ListingProps) {
  const {
    data: currentEntries,

    setPageIndex,
    pageIndex,
    totalPages,
    query,
    setQuery,
  } = useListState<any, MyFilter>({
    data: data.entries,
    defaultPageSize: 10,

    searchFn: (entry, query) => {
      return !query ? true : entry.searchContent.includes(query.toLowerCase());
    },
  });
  const scrollTo = useRef(null);
  return (
    <>
      <div className="mb-6">
        <div className={styles.controls}>
          <div ref={scrollTo} className={styles.facets}>
            <SearchInput
              $className={styles.facet}
              value={query}
              onChange={setQuery}
              placeholder="Search for a bus ..."
              ariaLabel="Search items"
            />
          </div>
        </div>
        {currentEntries.length ? (
          <div className="w-full mb-4 overflow-x-auto">
            <table className={`${tableStyles.table} min-w-full`}>
              <caption className="visually-hidden">Bus timetables</caption>
              <thead>
                <tr>
                  <th scope="col">Service Number, Operator and Date</th>
                  <th scope="col">Route and link to timetable</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((e: Entry) => {
                  return (
                    <tr key={e.sys.id}>
                      <td>
                        {e.serviceNumber && <p>{e.serviceNumber}</p>}

                        {e.busFaresLink && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: e.busFaresLink,
                            }}
                          ></span>
                        )}
                        {e.lastUpdated instanceof Date && (
                          <p>
                            Last updated: {e.lastUpdated.toLocaleDateString()}
                          </p>
                        )}
                        {e.supportingInformation && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: e.supportingInformation,
                            }}
                          ></span>
                        )}
                      </td>
                      <td>
                        {e.supportingInformation && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: e.supportingInformation,
                            }}
                          ></span>
                        )}

                        {e.timetableLink && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: e.timetableLink,
                            }}
                          ></span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              pageIndex={pageIndex}
              totalPages={totalPages}
              onPageChange={setPageIndex}
              scrollTo={scrollTo}
            />
          </div>
        ) : (
          <p>
            <strong>Nothing to display. Try clearing the search.</strong>
          </p>
        )}
      </div>
    </>
  );
}
export default BusServiceTimetables;
