import type { Metadata } from "next";

import "@/app/globals.css";

import styles from "@/app/page.module.css";
import Alert from "@/components/Alert";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import FooterInner from "@/components/FooterInner";
import GridWrapper from "@/components/shared/GridWrapper";
import Header from "@/components/Header";
import SharePage from "@/components/SharePage";
import SkipToMainContent from "@/components/SkipToMainContent";
import type { Entry } from "contensis-delivery-api/lib/models";
import { getRequestData } from "@/services/pagedata";

export type NavItem = {
  sys: { id: string; uri?: string };
  entryTitle: string;
  url?: string;
};
export type NavObj = {
  title: string;
  links: NavItem[];
};
export const metadata: Metadata = {
  title: {
    template: "%s | Cheshire East Council",
    default: "Cheshire East Council",
  },
  openGraph: { siteName: "Cheshire East Council", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { node, entry, theme, config } = await getRequestData();
  const themeEntry = theme.length ? theme[0] : ({} as Entry);
  const configEntry = config.length ? config[0] : ({} as Entry);
  const url = configEntry
    ? `${configEntry?.domain}${node?.path ? node.path : entry?.sys?.uri} `
    : "/";
  const navigation: NavObj = configEntry?.navigation;
  const tasks: NavObj = configEntry?.tasks;
  const alerts = configEntry?.alerts || null;

  return (
    <>
      <div className={styles.alerts}>
        <div className={alerts.length ? `skip-${alerts[0].type}` : ""}>
          <SkipToMainContent />
        </div>
        {alerts?.length
          ? alerts.map((e: Entry) => <Alert alert={e} key={e.sys?.id} />)
          : null}
      </div>
      <Header
        logo={themeEntry.logoDefault}
        navigation={navigation as NavObj}
        tasks={tasks}
        searchUrl={configEntry?.searchConfig[0].url.replace(
          "https://www.cheshireeast.gov.uk",
          "",
        )}
        queryParam={configEntry?.searchConfig[0].searchTermQueryParameter}
      />

      {children}

      <GridWrapper setMax={true} breakout={true}>
        <BackToTop />
        <SharePage
          url={url}
          description={entry?.description}
          title={entry?.entryTitle ?? entry?.title}
        />
      </GridWrapper>

      <Footer formId="pageFeedback" url={url}>
        <FooterInner
          logo={themeEntry.logoDefault}
          social={configEntry?.socialLinks}
          navigation={configEntry?.footerNavigation}
        />
      </Footer>
    </>
  );
}
