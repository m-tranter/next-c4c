import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRequestData } from "@/services/pagedata";
import Hero from "@/components/Hero";
import ElectionNav from "@/components/elections/ElectionNav";
import { getElection } from "@/services/election";
import { getAncestors } from "@/services/nodedata";
import styles from "@/app/page.module.css";
import WardResults from "./WardResults";

type Props = {
  params: Promise<{ election: string; wardname: string }>;
};

type Ward = { slug: string; wardName: string };

const findWard = (item: { electionWard?: unknown }, slug: string) =>
  ((item.electionWard ?? []) as Ward[]).find((w) => w.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { election, wardname } = await params;
  const item = await getElection(election);
  const ward = item ? findWard(item, wardname) : undefined;

  if (!ward) return { title: "Ward results" };

  const description = `Results for ${ward.wardName}`;
  return {
    title: ward.wardName,
    description,
    openGraph: { title: ward.wardName, description },
  };
}

export default async function WardPage({ params }: Props) {
  const { election, wardname } = await params;

  const item = await getElection(election);
  if (!item) notFound();

  const ward = findWard(item, wardname);
  if (!ward) notFound();

  const { node, status } = await getRequestData();

  const ancestors = node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";

  return (
    <>
      <Hero entryTitle={ward.wardName} breadcrumbs={ancestors} />
      <main id="main" className={styles.page}>
        <div className="pt-20 px-5 2xl:px-2 gap-x-8 mx-auto w-full grid grid-cols-12 min-w-0 max-w-(--page-max)">
          <div className="col-span-12 md:col-span-8">
            <WardResults
              initialElection={item}
              election={election}
              wardSlug={wardname}
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
