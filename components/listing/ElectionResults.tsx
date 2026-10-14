import type { Entry } from "contensis-delivery-api/lib/models";
import Link from "next/link";
import type { ListingProps } from "@/components/Canvas";

function ElectionResults({ data, basePath }: ListingProps) {
  return (
    <>
      <h2>Choose the results you want to see</h2>
      <ul>
        {data.entries.map((e: Entry) => {
          return (
            <li key={e.sys.id}>
              <a href={`${basePath}/elections-dashboard/${e.slug}`}>
                {e.dateString}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default ElectionResults;
