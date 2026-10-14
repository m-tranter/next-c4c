// lib/makeChartObj.ts
import type { ArcElement, ChartConfiguration, Plugin } from "chart.js";
// Type-only import: registers the `datalabels` plugin option types on Chart.js.
import type {} from "chartjs-plugin-datalabels";

const MOBILE_BREAKPOINT = 768;
const MIN_LABEL_SHARE = 3; // slices at or below this percentage get no label

const isMobile = (): boolean =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

const getDynamicPadding = () =>
  isMobile()
    ? { top: 0, bottom: 0, left: 0, right: 0 }
    : { top: 100, bottom: 75, left: 160, right: 160 };

type Slice = {
  value: number;
  text: string;
  label: string;
  colour: string;
};

// Orders slices largest, smallest, 2nd largest, 2nd smallest, ...
// so small slices are not clustered next to each other.
const interleavedSort = (
  data: number[],
  text: string[],
  labels: string[],
  colours: string[],
) => {
  const combined: Slice[] = data
    .map((value, i) => ({
      value,
      text: text[i],
      label: labels[i],
      colour: colours[i],
    }))
    .sort((a, b) => b.value - a.value);

  const result: Slice[] = [];
  let lo = combined.length - 1;
  let hi = 0;
  let takeLargest = true;

  while (hi <= lo) {
    result.push(takeLargest ? combined[hi++] : combined[lo--]);
    takeLargest = !takeLargest;
  }

  return {
    data: result.map((r) => r.value),
    text: result.map((r) => r.text),
    labels: result.map((r) => r.label),
    colours: result.map((r) => r.colour),
  };
};

export const makeChartObj = (
  data: number[],
  text: string[],
  labels: string[],
  colours: string[],
): ChartConfiguration<"pie"> => {
  const sorted = interleavedSort(data, text, labels, colours);

  const total = sorted.data.reduce((a, b) => a + b, 0);
  const isLargeSlice = (index: number): boolean =>
    total > 0 && (sorted.data[index] / total) * 100 > MIN_LABEL_SHARE;

  // Draws a leader line from each large slice towards its label.
  const pieLabelsLine: Plugin<"pie"> = {
    id: "pieLabelsLine",
    afterDraw(chart) {
      if (isMobile()) return;

      const ctx = chart.ctx;
      const { left, right, top, bottom } = chart.chartArea;
      const meta = chart.getDatasetMeta(0);

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      sorted.data.forEach((_, index) => {
        if (!isLargeSlice(index)) return;

        const arc = meta.data[index] as ArcElement;
        const angle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
        const radius = arc.outerRadius;
        const labelRadius = radius + 30;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius,
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * labelRadius,
          centerY + Math.sin(angle) * labelRadius,
        );
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });
    },
  };

  return {
    type: "pie",
    data: {
      labels: sorted.labels,
      datasets: [
        {
          backgroundColor: sorted.colours,
          data: sorted.data,
        },
      ],
    },
    plugins: [pieLabelsLine],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: getDynamicPadding(),
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          color: "black",
          display: (context) => !isMobile() && isLargeSlice(context.dataIndex),
          font: {
            weight: "bold",
            size: 14,
          },
          padding: 8,
          formatter: (_value, context) => sorted.text[context.dataIndex] ?? "",
          offset: 30,
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  };
};
