"use client";

import { useEffect, useState } from "react";
import WardTable from "@/components/elections/WardTable";
import WardChart from "@/components/elections/WardChart";
import { refreshElection } from "@/app/actions";

import type { ElectionResult } from "@/lib/electionMap";

type Props = {
  initialElection: ElectionResult;
  election: string;
  wardSlug: string;
  basePath: string;
};

export default function WardResults({
  initialElection,
  election,
  wardSlug,
  basePath,
}: Props) {
  const [item, setItem] = useState<ElectionResult>(initialElection);

  useEffect(() => {
    if (!item.liveUpdates) return;

    const id = item.sys.id;

    const interval = setInterval(async () => {
      try {
        const updated = await refreshElection(id);
        if (updated) setItem(updated);
      } catch {
        // keep current data if a poll fails
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [item.liveUpdates, item.sys.id]);

  const ward = item.electionWard.find((w) => w.slug === wardSlug);

  if (!ward) return <p>This ward is not part of this election.</p>;

  return (
    <div className="mt-3 space-y-4">
      <WardTable
        item={item}
        ward={ward}
        election={election}
        basePath={basePath}
      />

      <div>
        <h3 className="text-xl font-semibold">Votes</h3>
        <WardChart ward={ward} />
      </div>
    </div>
  );
}
