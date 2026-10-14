"use client";
import Table from "@/components/Table";

import type { ListingProps } from "@/components/Canvas";
export default function RoundaboutAdvertising({ data }: ListingProps) {
  const rows = data?.entries
    .filter((e) => e.available)
    .map((e) => {
      return (
        <tr key={e.sys.id}>
          <td>
            <a title="(external link - Google maps)" href={e.googleMapLink}>
              {e.roundabout}
            </a>
          </td>
          <td>{e.townTaxonomy.name}</td>
          <td>
            {e.signDetails.replace(/x-(\d*)$/, "X $1").replace(/-/g, " ")}
          </td>
        </tr>
      );
    });
  const headers = (
    <>
      <th scope="col">Roundabout</th>
      <th scope="col">Town</th>
      <th scope="col">Sign details</th>
    </>
  );
  return (
    <div className="mb-9 xl:px-0">
      <Table caption="Roundabout advertising" ths={headers} rows={rows} />
    </div>
  );
}
