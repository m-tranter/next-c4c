"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import Pagination from "@/components/listing/Pagination";
import PageSizeSelector from "@/components/listing/PageSizeSelector";
import { refreshElection } from "@/app/actions";

type Candidate = {
  wonSeat: boolean;
  wardName: string;
  wardSlug: string;
  partyName: string;
  partySlug: string;
  candidateName: string;
};

type Props = {
  initialElection: Entry;
  election: string;
  basePath: string;
};

export default function WardsTable({
  initialElection,
  election,
  basePath,
}: Props) {
  const [item, setItem] = useState<Entry>(initialElection);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

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

  const winners = useMemo(
    () =>
      ((item.electionCandidate ?? []) as Candidate[])
        .filter((c) => c.wonSeat)
        .sort((a, b) => a.wardName.localeCompare(b.wardName)),
    [item],
  );

  const totalPages = Math.max(1, Math.ceil(winners.length / pageSize));
  const currentPage = Math.min(pageIndex, totalPages - 1);
  const rows = winners.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  if (!winners.length) {
    return <p className="mt-2">No wards have declared yet.</p>;
  }

  return (
    <>
      <p>The results for each ward that has declared are shown below.</p>

      <div ref={tableRef} className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Results by ward</caption>
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th scope="col" className="p-2">
                Ward
              </th>
              <th scope="col" className="p-2">
                Party
              </th>
              <th scope="col" className="p-2">
                Elected
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={`${c.wardSlug}-${c.candidateName}`}
                className="border-b border-gray-200"
              >
                <td className="p-2">
                  <Link
                    href={`${basePath}/${election}/wards/${c.wardSlug}`}
                    className="text-blue-600 hover:underline"
                    prefetch={false}
                  >
                    {c.wardName}
                  </Link>
                </td>
                <td className="p-2">
                  <Link
                    href={`${basePath}/${election}/parties/${c.partySlug}`}
                    className="text-blue-600 hover:underline"
                    prefetch={false}
                  >
                    {c.partyName}
                  </Link>
                </td>
                <td className="p-2">{c.candidateName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pageIndex={currentPage}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        scrollTo={tableRef}
      />
      <PageSizeSelector
        $className="mb-2"
        pageSize={pageSize}
        totalItems={winners.length}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
