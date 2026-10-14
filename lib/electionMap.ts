import type { Entry } from "contensis-delivery-api/lib/models";
import { dateOptions2 } from "./helpers";

// Adjust these to match your Contensis content types.
export type RawParty = {
  id: number;
  partyName: string;
  partyHexColour: string;
  majorParty?: boolean;
  slug?: string;
  seats?: number;
  share?: number;
  votes?: number;
  votesStr?: string;
};

type RawCandidate = {
  candidateName: string;
  partyId: string;
  partyName: string;
  wardName: string;
  votes: number;
  wonSeat: boolean;
};

type RawWard = {
  wardName: string;
  ballotPapersRejected: number;
  status?: string;
  statusMessage?: string;
  candidates: number;
  turnout?: number | string;
  slug?: string;
};

type RawElection = {
  sys: Entry["sys"];
  slug: string;
  date: string;
  entryTitle: string;
  electionParty: RawParty[];
  electionCandidate: RawCandidate[];
  electionWard: RawWard[];
  liveUpdates?: boolean;
  showSpoiled?: boolean;
  showTurnout?: boolean;
};

type Rival = {
  partyName: string;
  partyHexColour: string;
  votes: number;
  votesStr: string;
};

const formatNum = (n: number): string => n.toLocaleString("en-US");

const makeSlug = (str: string): string => str.toLowerCase().replace(/\s/g, "-");

const percent = (t: number, v: number): number =>
  t ? Math.round((100 / t) * v * 10) / 10 : 0;

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

const unique = (xs: string[]): string[] => [...new Set(xs)];

const party = (n: string, c: string, s: number, v: number, sh: number) => ({
  partyName: n,
  partyHexColour: c,
  seats: s,
  votes: v,
  votesStr: formatNum(v),
  share: sh,
  slug: makeSlug(n),
});

export const electionMap = (entry: Entry) => {
  const raw = entry as unknown as RawElection;
  const {
    date: rawDate,
    electionParty: rawParties,
    electionCandidate: candidatesIn,
    electionWard: rawWards,
    ...rest
  } = raw;

  const date = new Date(rawDate);
  const totalVotes = sum(candidatesIn.map((c) => c.votes));
  const spoiled = sum(rawWards.map((w) => w.ballotPapersRejected));

  // Seats, votes and wards per party.
  const parties = rawParties.map((p) => {
    const byId = candidatesIn.filter((c) => parseInt(c.partyId, 10) === p.id);
    const votes = sum(byId.map((c) => c.votes));
    return {
      ...p,
      seats: byId.filter((c) => c.wonSeat).length,
      votes,
      votesStr: formatNum(votes),
      share: percent(totalVotes, votes),
      electedWards: unique(
        byId.filter((c) => c.wonSeat).map((c) => c.wardName),
      ),
      contestedWards: unique(
        candidatesIn
          .filter((c) => c.partyName === p.partyName)
          .map((c) => c.wardName),
      ).sort(),
    };
  });

  // Ward info.
  const wards = rawWards.map((w) => {
    const inWard = candidatesIn.filter((c) => c.wardName === w.wardName);
    const elected = inWard
      .filter((c) => c.wonSeat)
      .map((c) => `${c.candidateName} (${c.partyName})`);
    const partyNames = unique(
      parties
        .filter((p) => p.contestedWards.includes(w.wardName))
        .map((p) => p.partyName),
    );
    const rivals = partyNames
      .flatMap((name) => {
        const p = parties.find((obj) => obj.partyName === name);
        if (!p) return [];
        const votes = sum(
          inWard.filter((c) => c.partyName === p.partyName).map((c) => c.votes),
        );
        return [
          {
            label: p.partyName,
            colour: p.partyHexColour,
            votes,
            votesStr: formatNum(votes),
          },
        ];
      })
      .filter((r) => r.votes);
    return {
      ...w,
      elected,
      status: elected.length ? "Declared" : w.status,
      total: sum(inWard.map((c) => c.votes)),
      parties: partyNames,
      rivals,
    };
  });

  // Only parties that contested at least one ward.
  const active = parties.filter((p) => p.contestedWards.length);

  const withRivals = active.map((p) => {
    const others = active.filter(
      (o) => o.partyName !== p.partyName && !o.majorParty,
    );
    const cands = candidatesIn.filter((c) =>
      p.contestedWards.includes(c.wardName),
    );
    const otherCands = cands.filter((c) =>
      others.some((o) => o.partyName === c.partyName),
    );
    const otherVotes = sum(otherCands.map((c) => c.votes));

    const majorRivals = active
      .filter(
        (o) =>
          o.majorParty &&
          o.partyName !== p.partyName &&
          p.contestedWards.some((w) => o.contestedWards.includes(w)),
      )
      .sort((a, b) => a.partyName.localeCompare(b.partyName));

    const rivals: Rival[] = [p, ...majorRivals]
      .map((r) => {
        const votes = sum(
          cands.filter((c) => c.partyName === r.partyName).map((c) => c.votes),
        );
        return {
          partyName: r.partyName,
          partyHexColour: r.partyHexColour,
          votes,
          votesStr: formatNum(votes),
        };
      })
      .filter((r) => r.votes);

    if (otherCands.length) {
      rivals.push({
        partyName: "Other",
        partyHexColour: "#666",
        votes: otherVotes,
        votesStr: formatNum(otherVotes),
      });
    }

    return {
      ...p,
      rivals,
      wardShare: percent(sum(rivals.map((r) => r.votes)), p.votes),
    };
  });

  // Candidate shares.
  const candidates = candidatesIn.map((c) => {
    const ward = wards.find((w) => w.wardName === c.wardName);
    return {
      ...c,
      wardSlug: makeSlug(c.wardName),
      partySlug: makeSlug(c.partyName),
      share: ward ? percent(ward.total, c.votes) : 0,
      votesStr: formatNum(c.votes),
    };
  });

  // Major parties and "other" for the pie charts.
  const majorParties = withRivals
    .filter((p) => p.majorParty)
    .map((p) =>
      party(p.partyName, p.partyHexColour, p.seats, p.votes, p.share),
    );

  const minor = withRivals.filter((p) => !p.majorParty);
  const otherVotes = sum(minor.map((p) => p.votes));
  const other = party(
    "Other",
    "#DCDCDC",
    sum(minor.map((p) => p.seats)),
    otherVotes,
    percent(totalVotes, otherVotes),
  );
  const major = [...majorParties, other];

  return {
    ...rest,
    date,
    displayDate: date.toLocaleDateString("en-GB"),
    dateString: date.toLocaleDateString("en-GB", dateOptions2),
    totalVotes,
    totalVotesStr: formatNum(totalVotes),
    spoiled,
    totalSeats: sum(withRivals.map((p) => p.seats)),
    electionParty: [...withRivals].sort((a, b) =>
      a.partyName.localeCompare(b.partyName),
    ),
    electionWard: wards,
    electionCandidate: candidates,
    elected: candidates
      .filter((c) => c.wonSeat)
      .sort((a, b) => a.candidateName.localeCompare(b.candidateName)),
    major,
    other,
    votes: major.filter((e) => e.votes),
    seats: major.filter((e) => e.seats),
  };
};

export type ElectionResult = ReturnType<typeof electionMap>;
