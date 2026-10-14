"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import Pagination from "@/components/listing/Pagination";
import PageSizeSelector from "@/components/listing/PageSizeSelector";
import { refreshElection } from "@/app/actions";

type Candidate = {
  candidateName: string;
  partyName: string;
  partySlug?: string;
  wardName: string;
  wardSlug?: string;
  wonSeat: boolean;
};

type Props = {
  initialElection: Entry;
  election: string;
  basePath: string;
};

const slugify = (s: string) => s.toLowerCase().replace(/\s/g, "-");

export default function CouncillorsTable({
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

  const elected = useMemo(
    () =>
      ((item.electionCandidate ?? []) as Candidate[])
        .filter((c) => c.wonSeat)
        .sort((a, b) => a.candidateName.localeCompare(b.candidateName)),
    [item],
  );

  const totalPages = Math.max(1, Math.ceil(elected.length / pageSize));
  const currentPage = Math.min(pageIndex, totalPages - 1);
  const rows = elected.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <div>
      <p>
        <strong>Election date:</strong> {item.dateString}
      </p>

      {elected.length === 0 ? (
        <p className="mt-2">No councillors have been elected yet.</p>
      ) : (
        <>
          <div ref={tableRef} className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Election results table</caption>
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th scope="col" className="p-2">
                    Name
                  </th>
                  <th scope="col" className="p-2">
                    Party
                  </th>
                  <th scope="col" className="p-2">
                    Ward
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr
                    key={`${c.candidateName}-${c.wardName}`}
                    className="border-b border-gray-200"
                  >
                    <td className="p-2">{c.candidateName}</td>
                    <td className="p-2">
                      <Link
                        href={`${basePath}/${election}/parties/${c.partySlug ?? slugify(c.partyName)}`}
                        className="text-blue-600 hover:underline"
                        prefetch={false}
                      >
                        {c.partyName}
                      </Link>
                    </td>
                    <td className="p-2">
                      <Link
                        href={`${basePath}/${election}/wards/${c.wardSlug ?? slugify(c.wardName)}`}
                        className="text-blue-600 hover:underline"
                        prefetch={false}
                      >
                        {c.wardName}
                      </Link>
                    </td>
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
            totalItems={elected.length}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
          />
        </>
      )}
    </div>
  );
}
