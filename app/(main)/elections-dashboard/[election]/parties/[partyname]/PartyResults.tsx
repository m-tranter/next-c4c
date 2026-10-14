"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import { makeChartObj } from "@/lib/makeChartObj";
import { refreshElection } from "@/app/actions";

type Rival = {
  partyName: string;
  votes: number;
  votesStr: string;
  partyHexColour: string;
};

type Party = {
  slug: string;
  partyName: string;
  contestedWards?: string[];
  seats: number | string;
  votesStr: string;
  wardShare: number | string;
  rivals?: Rival[];
  electedWards?: string[];
};

type Props = {
  initialElection: Entry;
  election: string;
  partySlug: string;
  basePath: string;
};

export default function PartyResults({
  initialElection,
  election,
  partySlug,
  basePath,
}: Props) {
  const [item, setItem] = useState<Entry>(initialElection);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const party = ((item.electionParty ?? []) as Party[]).find(
    (p) => p.slug === partySlug,
  );

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

  const rivals = party?.rivals ?? [];
  const showChart = Boolean(party?.partyName && party?.wardShare);

  useEffect(() => {
    if (!showChart || !canvasRef.current || !rivals.length) return;

    let chart: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ Chart }, { default: ChartDataLabels }] = await Promise.all([
        import("chart.js/auto"),
        import("chartjs-plugin-datalabels"),
      ]);
      if (cancelled || !canvasRef.current) return;

      Chart.register(ChartDataLabels);

      chart = new Chart(
        canvasRef.current,
        makeChartObj(
          rivals.map((r) => r.votes),
          rivals.map((r) => `${r.partyName}\n${r.votesStr} vote(s)`),
          rivals.map((r) => r.partyName),
          rivals.map((r) => r.partyHexColour),
        ),
      );
    })();

    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [rivals, showChart]);

  if (!party) return <p>This party is not part of this election.</p>;

  const article = party.partyName.startsWith("The") ? "" : "the ";
  const suffix = party.partyName.toLowerCase().includes("party")
    ? ""
    : " party";
  const contested = party.contestedWards ?? [];

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        Results for {article}
        {party.partyName}
        {suffix}
      </h1>

      {contested.length > 0 && (
        <p className="mt-2">
          {article ? "The " : ""}
          {party.partyName}
          {suffix} contested {contested.length}{" "}
          <dfn title={`${contested.join(", ")}.`}>
            ward{contested.length !== 1 && "s"}
          </dfn>
          .
        </p>
      )}

      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{party.partyName} results table</caption>
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th scope="col" className="p-2">
                Party
              </th>
              <th scope="col" className="p-2 text-right">
                Seats
              </th>
              <th scope="col" className="p-2 text-right">
                Votes
              </th>
              <th scope="col" className="p-2 text-right">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2">{party.partyName}</td>
              <td className="p-2 text-right">{party.seats}</td>
              <td className="p-2 text-right">{party.votesStr}</td>
              <td className="p-2 text-right">{party.wardShare}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {showChart && (
        <div className="mt-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Share of votes in wards contested:
          </h2>
          <div className="relative mx-auto h-96 w-full md:h-[32rem]">
            <canvas ref={canvasRef} className="pie-chart" />
          </div>
        </div>
      )}

      <div className="mb-3 mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {rivals.map((r) => (
          <div key={r.partyName} className="flex items-center">
            <span
              className="inline-block h-4 w-4 shrink-0"
              style={{ backgroundColor: r.partyHexColour }}
            />
            <span className="pl-2">{r.partyName}</span>
          </div>
        ))}
      </div>

      {party.electedWards && party.electedWards.length > 0 && (
        <div className="mt-4">
          <h2 className="mt-3 text-xl font-semibold">
            Wards with an elected candidate
          </h2>
          <ul className="mt-2 space-y-1">
            {party.electedWards.map((w) => (
              <li key={w}>
                <Link
                  href={`${basePath}/${election}/wards/${w
                    .replace(/\s/g, "-")
                    .toLowerCase()}`}
                  className="text-blue-600 hover:underline"
                  prefetch={false}
                >
                  {w}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
