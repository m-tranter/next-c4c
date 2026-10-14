"use client";
import styles from "./Election.module.css";
import Legend from "./Legend";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Chart as ChartType } from "chart.js";
import { makeChartObj } from "@/lib/makeChartObj";
import { refreshElection } from "@/app/actions";
import type { Entry } from "contensis-delivery-api/lib/models";
import type { RawParty } from "@/lib/electionMap";

type Props = {
  initial: Entry;
  election: string;
  basePath: string;
};

export default function ElectionOverview({
  initial,
  election,
  basePath,
}: Props) {
  const [item, setItem] = useState<Entry>(initial);
  const votesCanvas = useRef<HTMLCanvasElement>(null);
  const seatsCanvas = useRef<HTMLCanvasElement>(null);

  // Draw (and redraw) the charts whenever the data changes.
  useEffect(() => {
    let cancelled = false;
    let votesChart: ChartType | undefined;
    let seatsChart: ChartType | undefined;

    (async () => {
      const { Chart } = await import("chart.js/auto");
      const ChartDataLabels = (await import("chartjs-plugin-datalabels"))
        .default;
      if (cancelled || !votesCanvas.current || !seatsCanvas.current) return;

      Chart.register(ChartDataLabels);

      votesChart = new Chart(
        votesCanvas.current,
        makeChartObj(
          item.votes.map((p: RawParty) => p.votes),
          item.votes.map(
            (p: RawParty) => `${p.partyName}\n${p.votesStr} vote(s)`,
          ),
          item.votes.map((p: RawParty) => p.partyName),
          item.votes.map((p: RawParty) => p.partyHexColour),
        ),
      );

      seatsChart = new Chart(
        seatsCanvas.current,
        makeChartObj(
          item.seats.map((p: RawParty) => p.seats),
          item.seats.map((p: RawParty) => `${p.partyName}\n${p.seats} seat(s)`),
          item.seats.map((p: RawParty) => p.partyName),
          item.seats.map((p: RawParty) => p.partyHexColour),
        ),
      );
    })();

    return () => {
      cancelled = true;
      votesChart?.destroy();
      seatsChart?.destroy();
    };
  }, [item]);

  // Poll for new results while the election is live.
  useEffect(() => {
    if (!item.liveUpdates) return;
    const id = item.sys.id;
    const timer = setInterval(async () => {
      try {
        const next = await refreshElection(id);
        if (next) setItem(next);
      } catch (err) {
        console.error("Election update failed", err);
      }
    }, 30_000);
    return () => clearInterval(timer);
  }, [item.liveUpdates, item.sys.id]);

  const hasSeats = item.seats.length > 0;
  const hideIfNoSeats = hasSeats ? undefined : { display: "none" };

  const partyPath = `${basePath}/elections-dashboard/${election}/parties`;
  return (
    <div className="elections">
      <div className="overflow-x-auto">
        <table className={`mt-2 mb-12 table-wrap ${styles.nums}`}>
          <caption className="hidden">Election overview table</caption>
          <thead>
            <tr>
              <th scope="col">Party</th>
              <th scope="col">Seats</th>
              <th scope="col">Votes</th>
              <th scope="col">Share of votes</th>
            </tr>
          </thead>
          <tbody>
            {item.major.map((p: RawParty) => (
              <tr key={p.partyName}>
                <td>
                  {p.partyName !== "Other" ? (
                    <Link href={`${partyPath}/${p.slug}`}>{p.partyName}</Link>
                  ) : (
                    <span>{p.partyName}</span>
                  )}
                </td>
                <td>{p.seats}</td>
                <td>{p.votesStr}</td>
                <td>{p.share}%</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Totals</strong>
              </td>
              <td>
                <strong>{item.totalSeats}</strong>
              </td>
              <td>
                <strong>{item.totalVotesStr}</strong>
              </td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>

      {item.showSpoiled && (
        <p className="ps-1 mb-0 mt-2">
          <strong>Rejected papers:</strong> {item.spoiled}
        </p>
      )}

      {hasSeats ? (
        <>
          <div className="grid grid-cols-1 gap-y-4 mt-2">
            <div className="w-full" style={hideIfNoSeats}>
              <h3 className="mb-0 text-[1.75rem] font-medium leading-tight">
                Seats
              </h3>
              <div className="chart-container">
                <canvas className="pie-chart" ref={seatsCanvas}></canvas>
              </div>
            </div>
            <div className="w-full">
              <h3 className="mb-0 mt-4 text-[1.75rem] font-medium leading-tight">
                Votes
              </h3>
              <div className="chart-container">
                <canvas className="pie-chart" ref={votesCanvas}></canvas>
              </div>
            </div>
          </div>
          <Legend parties={item.major} />
        </>
      ) : null}
    </div>
  );
}
