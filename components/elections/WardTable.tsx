import Link from "next/link";
import type { ElectionResult } from "@/lib/electionMap";

type Ward = ElectionResult["electionWard"][number];

type Props = {
  item: ElectionResult;
  ward: Ward;
  election?: string;
  basePath?: string;
  slideshow?: boolean;
};

export default function WardTable({
  item,
  ward,
  election,
  basePath,
  slideshow = false,
}: Props) {
  const declared = ward.status === "Declared";

  const candidates = item.electionCandidate
    .filter((c) => c.wardName === ward.wardName)
    .sort((a, b) => Number(b.share) - Number(a.share));

  return (
    <div>
      {ward.statusMessage && ward.statusMessage.length > 1 && (
        <div
          className="hero-unit mb-2 p-2"
          dangerouslySetInnerHTML={{ __html: ward.statusMessage }}
        />
      )}

      <h1 className="text-3xl font-semibold">Results for {ward.wardName}</h1>
      <p>
        <strong>Election date:</strong> {item.dateString}
      </p>
      <p>
        {ward.wardName} is represented by {ward.candidates} councillor
        {ward.candidates > 1 && "s"}.
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Results for {ward.wardName}</caption>
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th scope="col" className="p-2">
                Candidate
              </th>
              <th scope="col" className="p-2">
                Party
              </th>
              <th scope="col" className="p-2 text-right">
                Votes
              </th>
              <th scope="col" className="p-2 text-right">
                Share
              </th>
              <th scope="col" className="p-2">
                Elected
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={`${c.candidateName}-${c.partyName}`}
                className="border-b border-gray-200"
              >
                <td className="p-2">{c.candidateName}</td>
                <td className="p-2">
                  {slideshow ? (
                    c.partyName
                  ) : (
                    <Link
                      href={`${basePath}/${election}/parties/${c.partyName
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                      className="text-blue-600 hover:underline"
                    >
                      {c.partyName}
                    </Link>
                  )}
                </td>
                <td className="p-2 text-right">{declared ? c.votesStr : ""}</td>
                <td className="p-2 text-right">
                  {declared ? `${c.share}%` : ""}
                </td>
                <td className="p-2">
                  {c.wonSeat ? <strong>Yes</strong> : declared && "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ward.elected && ward.elected.length > 0 && (
        <>
          <h2 className="mt-3 text-2xl font-semibold">Elected:</h2>
          <ul>
            {ward.elected.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </>
      )}

      {item.showSpoiled && (
        <p>
          <strong>Rejected papers:</strong> {ward.ballotPapersRejected || 0}
        </p>
      )}
      {item.showTurnout && (
        <p>
          <strong>Turnout:</strong> {ward.turnout}%
        </p>
      )}
    </div>
  );
}
