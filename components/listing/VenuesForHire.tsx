"use client";

import type { Entry } from "contensis-delivery-api/lib/models";

import type { ListingProps } from "@/components/Canvas";

import { useListState } from "@/hooks/useListState";
import { useRef, Fragment } from "react";
import tableStyles from "./VenuesForHire.module.css";
import styles from "./Controls.module.css";
import SearchInput from "@/components/listing/SearchInput";

type MyFilter = {
  [key: string]: string;
};
function VenuesForHire({ data }: ListingProps) {
  const {
    data: currentEntries,
    query,
    setQuery,
  } = useListState<any, MyFilter>({
    data: data.entries,

    searchFn: (entry, query) => {
      return !query ? true : entry.searchContent.includes(query.toLowerCase());
    },
  });
  const locations = currentEntries.reduce((acc, e) => {
    const elem = acc.find((v: Entry) => v.loc === e.venueLocation);
    if (elem) {
      elem.items.push(e);
    } else {
      acc.push({ loc: e.venueLocation, items: [e] });
    }
    return acc;
  }, []);
  locations.sort((a: Entry, b: Entry) => a.loc.localeCompare(b.loc));
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
              placeholder="Search for a venue ..."
              ariaLabel="Search items"
            />
          </div>
        </div>
        {!locations.length && (
          <p>
            <strong>Nothing to display. Try clearing search.</strong>
          </p>
        )}
        {locations.map((l: Entry) => {
          return (
            <Fragment key={l.loc}>
              <h2 className="mt-9">{l.loc}</h2>

              <div className="w-full mb-4 overflow-x-auto">
                <table className={`${tableStyles.table} min-w-full`}>
                  <caption className="visually-hidden">{`${l.loc} venues`}</caption>
                  <thead>
                    <tr>
                      <th scope="col">
                        <strong>Venue</strong>
                      </th>
                      <th scope="col">
                        <strong>Details</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {l.items.map((v: Entry) => {
                      return (
                        <tr key={v.sys.id}>
                          <td>
                            {v.linkToWebsite ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: v.linkToWebsite,
                                }}
                              ></span>
                            ) : (
                              <span> {v.venueName}</span>
                            )}

                            {v.addressContactDetails && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: v.addressContactDetails,
                                }}
                              ></span>
                            )}
                          </td>
                          <td>
                            {v.venueDetails && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: v.venueDetails,
                                }}
                              ></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
export default VenuesForHire;
