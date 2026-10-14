"use client";
import type { Entry } from "contensis-delivery-api/lib/models";
import { removeSpaces, formatDate } from "@/lib/helpers";
import Icon from "@/components/shared/Icon";
import ChevronUp from "../Icons/ChevronUp";
import ChevronDown from "../Icons/ChevronDown";
import styles from "./Consultations.module.css";

import { useState, Fragment } from "react";

interface SurveyLink {
  label: string;
  target: string;
}
import type { ListingProps } from "@/components/Canvas";

const formatEntries = (arr: Entry[]) => {
  return arr.map((e) => {
    let day = new Date(e.date);
    e.date = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      23,
      59,
      59,
    );
    e.dateStr = formatDate(e.date);
    e.ref = removeSpaces(e.title);
    if (!e.consultationCode) {
      e.consultationCode =
        e.entryTitle.split(" ").slice(0, 2).join("") + e.date.getFullYear();
    }
    return e;
  });
};

export default function CouncilConsultationsCurrent({ data }: ListingProps) {
  const today = new Date();

  const current = formatEntries([...data.entries]).filter(
    (e: Entry) => e.date > today,
  );

  current.sort((a: Entry, b: Entry) => a.date - b.date);

  const [openState, setOpenState] = useState<boolean[]>(() =>
    current.map(() => false),
  );

  const toggleOne = (index: number) => {
    setOpenState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <Fragment>
      <div className="mt-12 flex flex-wrap">
        <h2 className="text-center w-full mb-9">Current consultations</h2>
        <div className="w-full md:w-full">
          {!current.length && (
            <p className="text-center">There are no current consultations.</p>
          )}
        </div>
      </div>

      {/* PAGEWATCH CODE="UKCHESHEC_76" */}
      {current.length > 0 && (
        <section className="mx-auto ">
          <div className="flex flex-wrap gap-y-2">
            {current.map((item, index) => {
              const isOpen = openState[index];
              return (
                <div className="w-full" key={item.sys.id}>
                  <details open={isOpen} className={styles.details}>
                    <summary
                      onClick={(e) => {
                        e.preventDefault();
                        toggleOne(index);
                      }}
                      className={`${styles.summary} cursor-pointer list-none`}
                    >
                      <div className="flex flex-wrap items-center">
                        <div className="mx-auto w-full md:mx-0 md:w-1/4">
                          {item.image && (
                            <img
                              className="rounded border border-gray-200 py-2"
                              src={`${item.image.asset.sys.uri}?format=webp`}
                              alt={item.image.altText}
                            />
                          )}
                        </div>
                        <div className="ml-0 w-full md:ml-auto md:w-3/4">
                          <div className="flex items-center">
                            <p className="mt-3 mb-0 flex-grow pe-3 text-xl md:ml-3">
                              {item.title}
                            </p>
                            <Icon size="xl">
                              {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </Icon>
                          </div>
                        </div>
                      </div>
                    </summary>

                    <div className="bg-green-50 border border-gray-400 rounded p-3 mt-2 mb-3">
                      <div
                        dangerouslySetInnerHTML={{ __html: item.introHTML }}
                      />

                      {item.html && (
                        <div className="mb-2 w-full md:w-2/3">
                          <div className="relative aspect-video">
                            <iframe
                              className="absolute inset-0 h-full w-full"
                              src={item.html}
                              title={item.title}
                            />
                          </div>
                        </div>
                      )}

                      <ul className="mb-2 list-none">
                        {item.surveyLinks.map((link: SurveyLink) => (
                          <li className="pb-3" key={link.label}>
                            <a href={link.target}>{link.label}</a>
                          </li>
                        ))}
                      </ul>
                      <p>
                        <strong>Closes {item.dateStr}</strong>
                      </p>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* /PAGEWATCH */}
    </Fragment>
  );
}
