"use client";

import type { Block } from "@contensis/canvas-react";
import { Fragment } from "react";

import GridWrapper from "@/components/shared/GridWrapper";
import { makeShortId } from "../lib/helpers";
import Accordion from "@/components/Accordion";
import BreakoutCanvas from "@/components/BreakoutCanvas";
import CTA from "@/components/CTA";
import CecTable from "@/components/GenericTable";
import ContactDetails from "@/components/ContactDetails";
import Content from "@/components/shared/Content";
import CustomCodeInjection from "@/components/CustomCodeInjection";
import Panel from "@/components/Panel";
import PromotionalBanner from "@/components/PromotionalBanner";
import PromotionalCentralSection from "@/components/PromotionalCentralSection";
import PromotionalColumns from "@/components/PromotionalColumns";
import PromotionalPullColumn from "@/components/PromotionalPullColumn";
import VideoEmbed from "@/components/VideoEmbed";

// listing components
import ApprovedPremises from "@/components/listing/ApprovedPremises";
import BusServiceTimetables from "@/components/listing/BusServiceTimetables";
import CouncilConsultations from "@/components/listing/CouncilConsultations";
import CouncilConsultationsCurrent from "@/components/listing/CouncilConsultationsCurrent";
import ElectionResults from "@/components/listing/ElectionResults";
import FamilyHubEvents from "@/components/listing/FamilyHubEvents";
import HmoLicences from "@/components/listing/HmoLicences";
import PremisesLicenceApplications from "./listing/PremisesLicenceApplications";
import RegisterOfficeCal from "@/components/listing/RegisterOfficeCal";
import RoundaboutAdvertising from "@/components/listing/RoundaboutAdvertising";
import VenuesForHire from "@/components/listing/VenuesForHire";
import WhatWasteGoesWhere from "@/components/listing/WhatWasteGoesWhere";

import type { Entry } from "contensis-delivery-api/lib/models";
export type CanvasProps = {
  data: MyBlock[];
  className?: string;
  noWrap?: boolean;
  fullWidth?: boolean;
  basePath?: string;
};
export type MyBlock = Block & {
  properties?: {
    component?: string;
  };
  fullWidth?: boolean;
};

export type ListingProps = {
  basePath?: string;
  data: {
    entries: Entry[];
  };
};

const componentMap: Record<
  string,
  React.ComponentType<{ id: string; data: any }>
> = {
  accordion: Accordion,
  callToAction: CTA,
  contacts: ContactDetails,
  customCodeInjection: CustomCodeInjection,
  fullBleedCanvas: BreakoutCanvas,
  promotionalBannerWithText: PromotionalBanner,
  promotionalCentralColumns: PromotionalColumns,
  promotionalCentralSection: PromotionalCentralSection,
  promotionalPullColumn: PromotionalPullColumn,
  videoEmbedPicker: VideoEmbed,
};

const listingComponentMap: Record<
  string,
  React.ComponentType<{ id: string; data: any; basePath?: string | undefined }>
> = {
  approvedPremises: ApprovedPremises,
  busServiceTimetables: BusServiceTimetables,
  councilConsultations: CouncilConsultations,
  councilConsultationsCurrent: CouncilConsultationsCurrent,
  electionResults: ElectionResults,
  familyHubEvents: FamilyHubEvents,
  hmoLicences: HmoLicences,
  roundaboutAdvertising: RoundaboutAdvertising,
  premisesLicenceApplications: PremisesLicenceApplications,
  registerOfficeCal: RegisterOfficeCal,
  venuesForHire: VenuesForHire,
  whatWasteGoesWhere: WhatWasteGoesWhere,
};

function renderComponent(block: MyBlock, basePath: string | undefined) {
  const type = (block?.properties as any)?.component as string;
  if (!type) {
    return;
  }
  const id = block.id;

  if (type === "listingPlaceholder") {
    return renderListingPlaceholder(block, basePath);
  }
  const Component = componentMap[type];
  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Canvas] Unknown component type: "${type}"`, block.id);
    }
    return null;
  }
  return <Component key={id} id={id} data={block.value} />;
}

function renderListingPlaceholder(block: Block, basePath: string | undefined) {
  const value = block.value as any;
  value.contentTypeId = value.contentTypeId.split(",")[0].trim();
  const id = block.id;
  const {
    contentTypeId,
    entries = [],
    genericTableComponent,
    name,
    contentType,
  } = value || {};

  if (genericTableComponent) {
    return (
      <CecTable
        key={id}
        fullBleed={block.value.fullWidth}
        fields={contentType?.fields}
        caption={name}
        entries={entries}
      />
    );
  }

  const Component = listingComponentMap[contentTypeId];
  const el = Component ? (
    <Component basePath={basePath} key={id} id={id} data={value} />
  ) : (
    <>
      <p>Listing placeholder: {contentTypeId}</p>
      <p>Id: {id}</p>
      <p>Entry count: {entries.length}</p>
    </>
  );
  return <Fragment key={id}>{el}</Fragment>;
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

const Canvas = ({ data, noWrap, fullWidth, basePath }: CanvasProps) => {
  if (!data || !Array.isArray(data) || !data.length) return null;
  let i = 0;
  const content = [];
  while (i < data.length) {
    if (!data[i]) {
      continue;
    }
    let normal = [];
    while (data[i]?.type !== "_component" && i < data.length) {
      if (
        data[i].type === "_panel" &&
        ["string", "number"].includes(typeof data[i].value)
      ) {
        normal.push(
          <Panel key={data[i].id} $value={data[i].properties}>
            {typeof data[i].value === "string"
              ? data[i].value
              : String(data[i].value)}
          </Panel>,
        );
      } else if (data[i]) {
        normal.push(<Content key={makeShortId(8)} data={data[i]} />);
      } else {
        return;
      }
      i += 1;
    }
    if (normal.length) {
      content.push(
        noWrap ? (
          <Fragment key={makeShortId(8)}>{normal}</Fragment>
        ) : (
          <GridWrapper key={makeShortId(8)} breakout={false} setMax={true}>
            {normal}
          </GridWrapper>
        ),
      );
    }

    {
      if (
        noWrap ||
        data[i]?.properties?.component === "promotionalPullColumn" ||
        data[i]?.properties?.component === "promotionalBannerWithText"
      ) {
        content.push(
          <Fragment key={data[i]?.id || makeShortId(8)}>
            {renderComponent(data[i], basePath)}
          </Fragment>,
        );
      } else if (data[i] && data[i].properties) {
        content.push(
          <GridWrapper
            key={data[i].id}
            setMax={!fullWidth}
            breakout={
              (fullWidth !== undefined && fullWidth === true) ||
              data[i].value.fullWidth === true
            }
          >
            {renderComponent(data[i], basePath)}
          </GridWrapper>,
        );
      }
      i += 1;
    }
  }
  return <>{content}</>;
};

export default Canvas;
