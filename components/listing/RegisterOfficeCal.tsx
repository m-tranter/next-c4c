"use client";

import { useState } from "react";
import { createVenues } from "@/lib/makeCal";

import styles from "./RegCal.module.css";

import CalModal from "./CalModal";
import type { MonthArr, Venue, DayObj } from "@/lib/makeCal";
import type { ListingProps } from "@/components/Canvas";
const rooms_url = `/register-office/ceremony-venues/ceremony-rooms`;

const parse = (cell: DayObj): string => {
  return !cell ? "" : Object.keys(cell)[0] || "";
};

const check = (cell: DayObj): boolean => {
  const k = parse(cell);
  // Look up the number[] array directly using the key
  const targetArray = cell[k];
  return !!(targetArray && targetArray.length);
};
let ids = {
  parlour: "#mayorsparlour",
  reception: "#mayorsreception",
  silk: "#silkroom",
  macclesfield: "#maccroom",
  register: "#regcrewe",
};
type RoomKey = keyof typeof ids;
const getUrl = (name: string): string => {
  let match = name.match(/parlour|reception|silk|macclesfield|register/i);
  return !match ? name : rooms_url + ids[match[0].toLowerCase() as RoomKey];
};

function RegisterOfficeCal({ data }: ListingProps) {
  const [venues, setVenues] = useState(createVenues(data.entries));
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const inc = (targetVenue: Venue) => {
    setVenues((prevVenues: Venue[]) =>
      prevVenues.map((venue: Venue) => {
        if (
          venue.name === targetVenue.name &&
          venue.ind + 1 < venue.cal.length
        ) {
          return { ...venue, ind: venue.ind + 1 };
        }
        return venue;
      }),
    );
  };

  const dec = (targetVenue: Venue) => {
    setVenues((prevVenues: Venue[]) =>
      prevVenues.map((venue) => {
        if (venue.name === targetVenue.name && venue.ind > 0) {
          return { ...venue, ind: venue.ind - 1 };
        }
        return venue;
      }),
    );
  };

  return (
    <div id="reg-cal" className={`${styles.container} p-4`}>
      {venues.map((venue: Venue) => {
        if (!venue.name) return null;

        const currentCal = venue.cal[venue.ind];
        const monthArrId = (currentCal?.monthArr as MonthArr)?.id;

        return (
          <div key={venue.name} className="mb-8 border-b pb-6 last:border-b-0">
            <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>
            <p className="mb-4">
              Read more about{" "}
              <a
                href={getUrl(venue.name)}
                className="text-blue-600 hover:underline"
              >
                {venue.name}
              </a>
              .
            </p>

            {/* Pagination Controls */}
            <div className="text-center inline-block rounded border border-gray-300 mb-4 bg-white shadow-sm">
              <div className="mx-auto flex items-center">
                <button
                  disabled={!venue.ind}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-l disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 transition"
                  type="button"
                  onClick={() => dec(venue)}
                >
                  &lt;
                </button>
                <span
                  className={`${styles.monthSpan} font-semibold text-center`}
                >
                  {currentCal.monthStr} {currentCal.year}
                </span>
                <button
                  disabled={venue.ind + 1 === venue.cal.length}
                  type="button"
                  className="px-3 py-1.5 bg-green-600 text-white rounded-r disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 transition"
                  onClick={() => inc(venue)}
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Calendar Table Container */}
            <div className={styles.tableResponsive}>
              <table className={`${styles.regCalTable} mb-3 usr_TableDefault`}>
                <caption className="sr-only">
                  Register Office Calendar {currentCal.monthStr}{" "}
                  {currentCal.year}
                </caption>
                <thead>
                  <tr className="text-center">
                    <th scope="col">Mon</th>
                    <th scope="col">Tue</th>
                    <th scope="col">Wed</th>
                    <th scope="col">Thu</th>
                    <th scope="col">Fri</th>
                    <th scope="col">Sat</th>
                    <th scope="col">Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentCal.monthArr as MonthArr)?.arr.map(
                    (row, rowIndex) => (
                      <tr
                        className="text-center"
                        key={`${monthArrId}_row_${rowIndex}`}
                      >
                        {row.map((cell: DayObj, i: number) => {
                          const dateParsed = parse(cell); // This is a string (the date key)
                          const isAvailable = check(cell); // This is a boolean
                          const cellId = `${dateParsed}_${monthArrId}_${i}`;

                          return (
                            <td
                              key={cellId}
                              className={isAvailable ? styles.available : ""}
                              tabIndex={isAvailable ? 0 : -1}
                              onClick={() => {
                                if (isAvailable) setActiveModalId(cellId);
                              }}
                              onKeyUp={(e) => {
                                if (e.key === "Enter" && isAvailable)
                                  setActiveModalId(cellId);
                              }}
                            >
                              <div>
                                {/* text-lg forces larger number text sizes */}
                                <p
                                  className={`${styles.availability} m-0 text-lg font-bold  leading-tight`}
                                >
                                  {dateParsed}
                                </p>

                                {/* text-base increases typography layout scale comfort */}
                                {isAvailable ? (
                                  <p
                                    className={`${styles.statusLabel} m-0 ${styles.availability} font-semibold`}
                                  >
                                    Available
                                  </p>
                                ) : dateParsed !== "" ? (
                                  <p className={styles.availability}>
                                    Unavailable
                                  </p>
                                ) : (
                                  <p className="m-0 leading-none text-base">
                                    &nbsp;
                                  </p>
                                )}
                              </div>

                              {/* Safe Inline React Modal Portal Overlay */}
                              {isAvailable && activeModalId === cellId && (
                                <div
                                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-black font-normal"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveModalId(null);
                                  }}
                                >
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full max-w-md"
                                  >
                                    <CalModal
                                      venue={venue}
                                      date={dateParsed}
                                      availability={
                                        cell[dateParsed]?.map(String) || []
                                      }
                                      onClose={() => setActiveModalId(null)}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default RegisterOfficeCal;
