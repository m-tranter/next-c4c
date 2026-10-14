import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRequestData } from "@/services/pagedata";
import { getElection } from "@/services/election";
import { getAncestors } from "@/services/nodedata";
import Slideshow from "./Slideshow";
type Props = {
  params: Promise<{ election: string }>;
};

export const metadata: Metadata = {
  title: "Slideshow",
  description: "Slideshow",
  robots: { index: false, follow: false },
};

export default async function SlideshowPage({ params }: Props) {
  const { election } = await params;

  const item = await getElection(election);
  if (!item) notFound();

  const { node, status } = await getRequestData();

  const ancestors = node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";

  return (
    <main id="main">
      <Slideshow
        initialElection={item}
        election={election}
        basePath={basePath}
      />
    </main>
  );
}
