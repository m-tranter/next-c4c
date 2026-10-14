"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ElectionResult } from "@/lib/electionMap";
import { refreshElection } from "@/app/actions";
import WardTable from "@/components/elections/WardTable";
import WardChart from "@/components/elections/WardChart";

type Props = {
  initialElection: ElectionResult;
  election: string;
  basePath: string;
};

export default function Slideshow({
  initialElection,
  election,
  basePath,
}: Props) {
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<ElectionResult>(initialElection);
  const itemRef = useRef<ElectionResult>(initialElection);

  useEffect(() => {
    const interval = setInterval(async () => {
      let current = itemRef.current;

      if (current.liveUpdates) {
        try {
          const updated = await refreshElection(current.sys.id);
          if (updated) {
            current = updated;
            itemRef.current = updated;
            setItem(updated);
          }
        } catch {
          // keep current data if a poll fails
        }
      }

      const total = (current.electionWard ?? []).length;
      if (total) setIndex((i) => (i + 1) % total);
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  const wards = item.electionWard ?? [];
  if (!wards.length) {
    return <p className="p-5">No wards are available for this election.</p>;
  }

  const ward = wards[index % wards.length];
  const showChart =
    item.sys.contentTypeId === "electionResults" || ward.status === "Declared";

  return (
    <div className="relative mt-5 grid grid-cols-1 gap-8 px-5 md:grid-cols-2">
      <Link
        href={`${basePath}/elections-dashboard/${election}`}
        id="close-btn"
        aria-label="Close"
        className="absolute right-5 top-0 flex h-8 w-8 items-center justify-center rounded border border-gray-400 text-xl leading-none hover:bg-gray-100"
      >
        ×
      </Link>

      <div>
        <WardTable key={index} slideshow item={item} ward={ward} />
      </div>

      <div>
        {showChart ? (
          <>
            <h3 className="text-center text-xl font-semibold">Votes</h3>
            <WardChart key={index} ward={ward} />
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold">Status</h3>
            <p>
              {ward.wardName} is currently{" "}
              {ward.status?.toLowerCase() ?? "unknown"}.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end md:col-span-2">
        <img
          alt="Cheshire East Logo"
          id="logo"
          className="h-auto max-w-full"
          src="https://www.cheshireeast.gov.uk/images/non_user/cec-logo-colour-155x70px.png"
        />
      </div>
    </div>
  );
}
