import { useState } from "react";
import { useOverflow } from "../hooks/useOverflow";

import styles from "./EventCard.module.css";

import { type FamilyHubItem } from "@/lib/eventUtils";

type Props = {
  item: FamilyHubItem;
};
export default function EventCard({ item }: Props) {
  const { containerRef, imageRef, overflows, checkOverflow } = useOverflow();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="lg:w-1/3 w-full text-center">
          <img
            ref={imageRef}
            className="border border-gray-300 rounded w-full object-cover"
            src={item.image?.asset?.sys?.uri}
            alt={item.image?.altText || ""}
            onLoad={checkOverflow}
          />
        </div>

        <div className="lg:w-2/3 w-full">
          <div
            ref={containerRef}
            className={`${styles.collapsible} ${
              overflows ? styles.overflows : ""
            } ${expanded ? styles.expanded : ""}`}
          >
            <h3 className="mb-2">{item.entryTitle}</h3>

            {item.hasAlert &&
              item.familyEventAlert?.map(
                (alert: any, i: number) =>
                  alert.display && (
                    <p key={i} className="text-red-600 font-bold mb-1">
                      {alert.message}
                    </p>
                  ),
              )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
              <div>
                <strong>Location: </strong>
                <a
                  className="text-teal-700 underline"
                  title={`${item.hub?.address} | Google maps`}
                  href={item.mapLink}
                >
                  {item.hub?.entryTitle}
                </a>
              </div>
              <div>
                <strong>Categories: </strong>
                {item.filterCategories
                  ?.map((c: string) => c.replace(" Targeted", ""))
                  .join(", ")}
              </div>
              <div>
                <strong>Days: </strong>
                {item.daysOfWeek?.join(", ")}
              </div>
              <div>
                <strong>Time: </strong>
                {item.timeStr}
              </div>
              {!!item.date?.length && (
                <div>
                  <strong>Dates: </strong>
                  {item.date
                    .map((d) => new Date(d as string).toLocaleDateString())
                    .join(", ")}
                </div>
              )}
              {item.additionalNotes && (
                <div>
                  <strong>Note: </strong>
                  {item.additionalNotes}
                </div>
              )}
              {item.distance !== undefined && (
                <div>
                  <strong>Distance: </strong>
                  {item.distance.toFixed(1)} miles
                </div>
              )}
            </div>

            <div dangerouslySetInnerHTML={{ __html: item.eventHTML }} />
          </div>

          {overflows && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="hidden lg:block mt-2 w-28 bg-gray-800 text-white rounded px-3 py-1 text-sm"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
