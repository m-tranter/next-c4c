import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRequestData } from "@/services/pagedata";
import Hero from "@/components/Hero";
import ElectionNav from "@/components/elections/ElectionNav";
import { getElection } from "@/services/election";
import { getAncestors } from "@/services/nodedata";
import styles from "@/app/page.module.css";
import PartyResults from "./PartyResults";

type Props = {
  params: Promise<{ election: string; partyname: string }>;
};

type Party = { slug: string; partyName: string };

const findParty = (item: { electionParty?: unknown }, slug: string) =>
  ((item.electionParty ?? []) as Party[]).find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { election, partyname } = await params;
  const item = await getElection(election);
  const party = item ? findParty(item, partyname) : undefined;
  console.log(partyname);

  if (!party) return { title: "Party results" };

  const description = `Results for ${party.partyName}`;
  return {
    title: party.partyName,
    description,
    openGraph: { title: party.partyName, description },
  };
}

export default async function PartyPage({ params }: Props) {
  const { election, partyname } = await params;

  const item = await getElection(election);
  if (!item) notFound();

  const party = findParty(item, partyname);
  if (!party) notFound();

  const { node, status } = await getRequestData();

  const ancestors = node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";

  return (
    <>
      <Hero entryTitle={party.partyName} breadcrumbs={ancestors} />
      <main id="main" className={styles.page}>
        <div className="pt-20 px-5 2xl:px-2 gap-x-8 mx-auto w-full grid grid-cols-12 min-w-0 max-w-(--page-max)">
          <div className="col-span-12 md:col-span-8">
            <PartyResults
              initialElection={item}
              election={election}
              partySlug={partyname}
              basePath={basePath}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <ElectionNav election={election} basePath={basePath} />
          </div>
        </div>
      </main>
    </>
  );
}
