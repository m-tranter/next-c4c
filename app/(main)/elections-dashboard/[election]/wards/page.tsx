import type { Metadata } from "next";

import { getRequestData } from "@/services/pagedata";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import ElectionNav from "@/components/elections/ElectionNav";
import { getElection } from "@/services/election";
import styles from "@/app/page.module.css";
import WardsTable from "./WardsTable";

import { getAncestors } from "@/services/nodedata";

type Props = {
  params: Promise<{ election: string }>;
  searchParams: Promise<{ slug?: string }>;
};

const TITLE = "Wards with declared seats";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { election } = await params;
  const item = await getElection(election);
  const description = item
    ? `Wards with declared seats for ${item.dateString}`
    : TITLE;

  return {
    title: TITLE,
    description,
    openGraph: { title: TITLE, description },
  };
}

export default async function WardsPage({ params }: Props) {
  const { election } = await params;

  const item = await getElection(election);
  if (!item) notFound();

  const { node, status } = await getRequestData();

  const ancestors = node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";

  return (
    <>
      <Hero entryTitle="Wards" breadcrumbs={ancestors} />
      <main id="main" className={styles.page}>
        <div className="pt-20 px-5 2xl:px-2 gap-x-8 mx-auto w-full grid grid-cols-12 min-w-0 max-w-(--page-max)">
          <div className="col-span-12 md:col-span-8">
            <WardsTable
              initialElection={item}
              election={election}
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
