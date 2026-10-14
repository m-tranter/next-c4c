import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getElection } from "@/services/election";
import Hero from "@/components/Hero";
import ElectionOverview from "@/components/elections/ElectionOverview";
import ElectionNav from "@/components/elections/ElectionNav";
import { getRequestData } from "@/services/pagedata";

import { getAncestors } from "@/services/nodedata";
import styles from "@/app/page.module.css";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { params: Promise<{ election: string }> };

async function load(election: string) {
  const entry = await getElection(election);
  return entry ? entry : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { election } = await params;
  const item = await load(election);
  const description = item
    ? `Overview of the election results for ${item.dateString}`
    : "Overview of the election results";

  return {
    title: "Overview",
    description,
    openGraph: { title: "Overview", description },
  };
}

export default async function ElectionPage({ params }: Params) {
  const { election } = await params;
  const item = await load(election);
  if (!item) notFound();

  const { node, status } = await getRequestData();

  const ancestors = node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";

  return (
    <>
      <Hero entryTitle="Overview" breadcrumbs={ancestors} />
      <main id="main" className={styles.page}>
        <div className="pt-20 g-x-8 px-5 2xl:px-2 mx-auto w-full grid grid-cols-12 min-w-0 max-w-(--page-max)">
          <div className="col-span-12 md:col-span-8">
            <ElectionOverview
              basePath={basePath}
              initial={item}
              election={election}
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
