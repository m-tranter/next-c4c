"use client";

import { useEffect, useRef } from "react";
import { makeChartObj } from "@/lib/makeChartObj";
import type { ElectionResult } from "@/lib/electionMap";

type Ward = ElectionResult["electionWard"][number];
type Rival = Ward["rivals"][number];
type Props = {
  ward: Ward;
};

function formatLabel(r: Rival) {
  const nameWords = r.label.split(" ");
  let label = r.label;
  if (nameWords.length > 5) {
    label = `${nameWords.slice(0, 3).join(" ")}\n${nameWords.slice(3).join(" ")}`;
  }
  return `${label}\n${r.votesStr} vote(s)`;
}

export default function WardChart({ ward }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rivals = ward.rivals ?? [];

  useEffect(() => {
    if (!canvasRef.current || !rivals.length) return;

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
          rivals.map(formatLabel),
          rivals.map((r) => r.label),
          rivals.map((r) => r.colour),
        ),
      );
    })();

    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [rivals]);

  return (
    <>
      <div className="relative mx-auto h-96 w-full md:h-[32rem]">
        <canvas ref={canvasRef} className="pie-chart" />
      </div>
      <div className="mx-auto mt-3 flex w-5/6 flex-wrap justify-center gap-x-4 gap-y-1">
        {rivals.map((p) => (
          <div key={`${p.label}-${p.colour}`} className="flex items-center">
            <span
              className="inline-block h-4 w-4 shrink-0"
              style={{ backgroundColor: p.colour }}
            />
            <span className="pb-1 pl-2">{p.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
