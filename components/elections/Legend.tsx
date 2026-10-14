import type { RawParty } from "@/lib/electionMap";
import styles from "./Election.module.css";

function Legend({ parties }: { parties: RawParty[] }) {
  return (
    <>
      <h4 className="mb-2 text-2xl font-medium leading-tight">Legend</h4>
      <div className="mx-auto mt-3 flex w-full flex-wrap gap-x-6 gap-y-1">
        {parties.map((p: RawParty) => (
          <div
            className={`${styles.legendwrapper} flex w-auto shrink-0`}
            key={p.partyName}
          >
            <span
              className={`${styles.legend} my-auto`}
              style={{ backgroundColor: p.partyHexColour }}
            ></span>
            <span className="ps-2">{p.partyName}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Legend;
