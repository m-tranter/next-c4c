import {
  getRequestData,
  resolveContentTypePlaceholders,
} from "@/services/pagedata";
import type { Entry } from "contensis-delivery-api/lib/models";

import type { Asset } from "@/lib/seo";
import Hero from "@/components/Hero";

import styles from "@/app/page.module.css";
import { getAncestors } from "@/services/nodedata";
import { notFound } from "next/navigation";
import type { MyBlock } from "@/components/Canvas";
import { getSEOProps } from "@/lib/seo";
import Banner from "@/components/Banner";
import GridWrapper from "@/components/shared/GridWrapper";

import type { Metadata } from "next";
import Canvas from "@/components/Canvas";

export type Composer = {
  type: string;
  value: MyBlock[];
};

export async function generateMetadata(): Promise<Metadata> {
  const { node, entry, config } = await getRequestData();
  const configEntry = config.length ? config[0] : ({} as Entry);

  return getSEOProps(
    configEntry,
    entry?.metaInfo,
    entry?.entryTitle,
    entry?.entryDescription,
    node?.path ?? "/",
  );
}

export default async function CatchAll() {
  const { entry, node, status } = await getRequestData();

  const ancestors =
    process.env.ALIAS && node?.id ? await getAncestors(node.id, status) : [];

  const basePath = ancestors?.length
    ? ancestors[ancestors.length - 1].path
    : "/";
  if (!entry) notFound();

  let resolvedContent = [];
  if (entry.content) {
    try {
      resolvedContent = await Promise.all(
        entry.content.map(async (e: Composer) => {
          if (e.type === "text") {
            let temp = await resolveContentTypePlaceholders(e.value);
            e.value = temp;
          }
          return e;
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Hero
        entryTitle={entry?.entryTitle}
        description={entry?.hero?.description}
        breadcrumbs={ancestors}
        heroImage={entry?.hero?.image as Asset}
      />

      <main id="main" className={styles.page}>
        <div className="pt-20">
          {resolvedContent.map((c: Composer | any, i: number) => {
            const key = `${c.type}_${i}`;
            if (!Array.isArray(c.value)) {
              return (
                <Canvas
                  basePath={basePath}
                  fullWidth={false}
                  data={[c]}
                  key={key}
                />
              );
            } else if (c.type == "banner") {
              return (
                <GridWrapper key={key} setMax={true} breakout={true}>
                  <Banner data={c.value} key={key} />
                </GridWrapper>
              );
            } else {
              const fullWidth = c.value.some((e: MyBlock) => e.fullWidth);
              return (
                <Canvas
                  basePath={basePath}
                  fullWidth={fullWidth}
                  data={c.value}
                  key={key}
                />
              );
            }
          })}
        </div>
      </main>
    </>
  );
}
