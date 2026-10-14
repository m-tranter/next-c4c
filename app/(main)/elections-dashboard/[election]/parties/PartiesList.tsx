"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import { refreshElection } from "@/app/actions";

type Party = {
  id: string;
  slug: string;
  partyName: string;
};

type Props = {
  initialElection: Entry;
  election: string;
  basePath: string;
};

export default function PartiesList({
  initialElection,
  election,
  basePath,
}: Props) {
  const [item, setItem] = useState<Entry>(initialElection);

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
    }, 60_000);
    return () => clearInterval(interval);
  }, [item.liveUpdates, item.sys.id]);

  const parties = useMemo(
    () =>
      [...((item.electionParty ?? []) as Party[])].sort((a, b) =>
        a.partyName.localeCompare(b.partyName),
      ),
    [item],
  );

  const partyPath = `${basePath}/elections-dashboard/${election}`;
  return (
    <div>
      <p>
        Select a party from the list below to see the results for that party.
      </p>
      <ul className="mt-4 space-y-2">
        {parties.map((p) => (
          <li key={p.id}>
            <Link
              href={`${partyPath}/${p.slug}`}
              className="text-blue-600 hover:underline"
              prefetch={false}
            >
              {p.partyName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
