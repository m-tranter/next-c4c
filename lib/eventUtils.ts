import { createRenderer } from "@contensis/canvas-html";
import type { Block } from "@contensis/canvas-react";
import type { Entry } from "contensis-delivery-api/lib/models";

const renderer = createRenderer();

export const CAT_RX =
  /baby|craft|book|chess|board|lego|mega blok|builder|stories|rhymetime|toddler/i;

type CategoryKey =
  | "baby"
  | "book"
  | "chess"
  | "board"
  | "craft"
  | "lego"
  | "mega blok"
  | "builder"
  | "stories"
  | "toddler"
  | "none"
  | "rhymetime";

export const CAT_LOOKUP: Record<CategoryKey, string[]> = {
  baby: ["Baby"],
  book: ["0-11"],
  chess: ["All"],
  board: ["0-19"],
  craft: ["0-5"],
  lego: ["0-5"],
  "mega blok": ["0-5"],
  builder: ["0-5"],
  stories: ["0-11"],
  toddler: ["0-5"],
  none: [],
  rhymetime: ["0-5"],
};

export const IMAGE_BASE_URL = "/image-library/family-hub-events/";

export const IMAGE_LOOKUP: Record<CategoryKey, string> = {
  baby: "Baby-Bounce600x400.jpg",
  chess: "Chess-Club600x400.jpg",
  board: "Board-Games600x400.jpg",
  craft: "Crafts600x400.jpg",
  lego: "Lego600x400.jpg",
  "mega blok": "Mega-Blocks600x400.jpg",
  builder: "Builders600x400.jpg",
  rhymetime: "Stories-Rhymes600x400.jpg",
  stories: "Stories-Rhymes600x400.jpg",
  toddler: "Toddler600x400.jpg",
  book: "familyHub.jpg",
  none: "familyHub.jpg",
};

export const EVENT_STRINGS = [
  "after school board game",
  "baby bounce",
  "builders",
  "chess",
  "childrens book",
  "childrens craft",
  "childrens games",
  "lego",
  "mega blok",
  "rhymetime",
  "saturday crafts",
  "stories & songs",
  "toddler time",
];

export const ALL_CATEGORIES = [
  "Antenatal",
  "Baby",
  "0-5",
  "0-11",
  "0-11 SEND",
  "8-12",
  "8-16",
  "0-19",
  "0-25 SEND",
  "Cared For",
  "Care Leavers",
  "Adult",
];

// ---------------------------------------------------------------------------
// Shared shapes
// ---------------------------------------------------------------------------

export type Location = {
  lat?: number;
  lon?: number;
};

export type FamilyEventAlertRaw = {
  message?: string;
  displayFrom?: string;
  displayTo?: string;
  [key: string]: unknown;
};

export type FamilyEventAlert = FamilyEventAlertRaw & {
  display?: boolean;
};

export type ImageAsset = {
  altText?: string;
  asset: {
    sys: {
      uri: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

/**
 * The additional fields used by familyHubEvents entries.
 *
 * Entry remains the underlying Contensis type; this only describes the
 * content-type-specific fields used by this component.
 */
type FamilyHubEventEntry = Entry & {
  hub?: Entry & {
    name?: string;
    town?: string;
    location?: Location;
  };
  startTime?: string;
  endTime?: string;
  eventDetails?: Block[];
  image?: ImageAsset;
  familyEventAlert?: FamilyEventAlertRaw[];
  keywords?: string;
  alert?: {
    message?: string;
  };
  activityName?: string;
  additionalNotes?: string;
};

/**
 * The additional fields used by libraryActivityCopy entries.
 */
type LibraryActivityEntry = Entry & {
  regular?: {
    eventDetails?: string;
    eventName?: string;
    day?: string;
    time?: string;
  };
};

/**
 * Normalised item consumed by the Family Hub UI.
 *
 * The source records are Contensis Entries, but library items are generated
 * objects rather than Entries themselves, so they should not be typed as
 * Entry.
 */
export type FamilyHubItem = {
  sys?: Pick<Entry["sys"], "id">;
  entryTitle?: string;
  date: unknown[];
  eventHTML: string;
  filterCategories: string[];
  keywords: string;
  daysOfWeek: string[];
  image?: ImageAsset;
  additionalNotes: string;
  searchContent: string;
  timeStr: string;
  hub?: Entry & {
    name?: string;
    town?: string;
    location?: Location;
  };
  mapLink?: string;
  hasAlert?: boolean;
  familyEventAlert?: FamilyEventAlert[];
  distance?: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function stripTags(str = ""): string {
  return str ? str.replace(/<\/?[^>]*>/g, "") : "";
}

export function addYears(str: string): string {
  return str.replace(/(\d{1,2}-\d{1,2})(\s?)/, "$1 Years$2");
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return "TBC";

  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;

  if (!minutes) {
    return `${hour12}${hour12 === 12 ? "noon" : period}`;
  }

  return `${hour12}:${minutes.toString().padStart(2, "0")}${period}`;
}

export function formatTimeRange(start?: string, end?: string): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function googleMapsLink(hubName: string, location?: Location): string {
  const { lat, lon } = location || {};

  const query =
    lat != null && lon != null ? `${lat},${lon}+${hubName}` : hubName;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const POSTCODE_RX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

export function isPostcodeValid(postcode: string): boolean {
  return POSTCODE_RX.test(postcode.trim());
}

function getCategoryKey(title: string): CategoryKey {
  const match = title.match(CAT_RX);

  if (!match) {
    return "none";
  }

  const category = match[0].toLowerCase();

  if (Object.prototype.hasOwnProperty.call(CAT_LOOKUP, category)) {
    return category as CategoryKey;
  }

  return "none";
}

// ---------------------------------------------------------------------------
// Item builders
// ---------------------------------------------------------------------------

export function buildFamilyHubItems({
  events,
  today,
}: {
  events: FamilyHubEventEntry[];
  today: Date;
}): FamilyHubItem[] {
  return events
    .filter((event) => event.hub?.name)
    .map((event) => {
      const timeStr = formatTimeRange(event.startTime, event.endTime);

      const eventHTML = renderer({
        data: event.eventDetails ?? [],
      });

      const image = event.image
        ? {
            ...event.image,
            asset: {
              ...event.image.asset,
              sys: {
                ...event.image.asset.sys,
                uri: event.image.asset.sys.uri,
              },
            },
          }
        : undefined;

      let hasAlert = false;

      const familyEventAlert: FamilyEventAlert[] = (
        event.familyEventAlert ?? []
      ).map((alert): FamilyEventAlert => {
        if (alert.message && alert.displayFrom && alert.displayTo) {
          const from = new Date(alert.displayFrom);
          const to = new Date(alert.displayTo);
          const display = today > from && today < to;

          if (display) {
            hasAlert = true;
          }

          return {
            ...alert,
            display,
          };
        }

        return alert;
      });

      const searchContent = [
        event.keywords,
        event.alert?.message,
        event.activityName,
        event.hub?.entryTitle,
        stripTags(eventHTML),
        event.additionalNotes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return {
        sys: {
          id: event.sys.id,
        },
        entryTitle: event.entryTitle,
        date: [],
        eventHTML,
        filterCategories: [],
        keywords: event.keywords ?? "",
        daysOfWeek: [],
        image,
        additionalNotes: event.additionalNotes ?? "",
        searchContent,
        timeStr,
        hub: event.hub,
        hasAlert,
        familyEventAlert,
        mapLink: event.hub
          ? googleMapsLink(
              event.hub.name ?? event.hub.entryTitle,
              event.hub.location,
            )
          : undefined,
      };
    });
}

export function buildLibraryItems({
  libraryEvents,
  libraries,
}: {
  libraryEvents: LibraryActivityEntry[];
  libraries: Entry[];
}): FamilyHubItem[] {
  const items = libraryEvents.filter(
    (event) =>
      EVENT_STRINGS.some((eventString) =>
        event.entryTitle.toLowerCase().includes(eventString),
      ) && Boolean(event.regular?.eventDetails),
  );

  return items.map((event) => {
    const cat = getCategoryKey(event.entryTitle);
    const imgUrl = `${IMAGE_BASE_URL}${IMAGE_LOOKUP[cat]}`;

    const hub = libraries.find((library) => event.title.includes(library.town));

    const regular = event.regular;

    return {
      date: [],
      eventHTML: regular?.eventDetails ?? "",
      entryTitle: event.title,
      filterCategories: CAT_LOOKUP[cat],
      keywords: "",
      daysOfWeek: regular?.day ? [regular.day] : [],
      image: regular?.eventName
        ? {
            altText: regular.eventName,
            asset: {
              sys: {
                uri: imgUrl,
              },
            },
          }
        : {
            asset: {
              sys: {
                uri: imgUrl,
              },
            },
          },
      additionalNotes: "",
      searchContent: `${stripTags(
        regular?.eventDetails ?? "",
      )} ${event.title}`.toLowerCase(),
      timeStr: regular?.time ?? "",
      hub,
      mapLink: hub
        ? googleMapsLink(hub.name ?? hub.entryTitle, hub.location)
        : undefined,
      sys: {
        id: event.sys.id,
      },
    };
  });
}
