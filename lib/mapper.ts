import type { Entry } from "contensis-delivery-api/lib/models";
import { dateOptions, dateOptions2 } from "./helpers";
import { stripTags } from "./eventUtils";
import { endOfDay } from "./helpers";

const today = new Date();

export function mapEntries(entries: Entry[]): Entry[] {
  const CT = entries[0]?.sys?.contentTypeId;
  let myEntries = [...entries];

  switch (CT) {
    case "councilConsultations":
      myEntries.forEach((e) => {
        if (e.date) {
          let date = new Date(e.date);
          e.date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
          );
          e.dateStr = date.toLocaleDateString("en-GB", dateOptions);
          e.ref = e.title.replace(/\s+/g, "");
          if (!e.consultationCode) {
            e.consultationCode =
              e.entryTitle.split(" ").slice(0, 2).join("") +
              e.date.getFullYear();
          }
        }
      });
      break;

    case "electionResults":
      myEntries.forEach((e) => {
        e.date = new Date(e.date);
        e.dateString = e.date.toLocaleDateString("en-GB", dateOptions2);
        e.slug = e.dateString.replace(/\s/g, "-");
      });
      break;
    case "hmoLicences":
      myEntries.forEach((e) => {
        e.dateStr = new Date(e.expiryDate).toLocaleDateString("en-GB");
        e.searchContent =
          `${e.entryTitle} ${e.buildingName} ${e.area} ${e.postcode}`.toLowerCase();
      });
      break;
    case "premisesLicenceApplications":
      myEntries = myEntries
        .map((e) => {
          e.lastDateForRepresentations = endOfDay(
            new Date(e.lastDateForRepresentations),
          );
          return e;
        })
        .filter((f) => f.lastDateForRepresentations >= today);
      myEntries.sort((a, b) => a.date - b.date);
      break;
    case "whatWasteGoesWhere":
      myEntries.forEach((e) => {
        e.searchContent =
          `${e.entryTitle} ${e.keywords} ${e.item}`.toLowerCase();
      });
      break;
    case "busServiceTimetables":
      myEntries.forEach((e) => {
        e.searchContent =
          `${e.entryTitle} ${e.serviceNumber} ${stripTags(e.supportingInformation)}`
            .replace(/\n/g, " ")
            .toLowerCase();
      });
      break;
    case "venuesForHire":
      myEntries.forEach((e) => {
        e.searchContent =
          `${e.entryTitle} ${e.venueLocation} ${stripTags(e.venueDetails)} ${stripTags(e.addressContactDetails)}`
            .replace(/\n/g, " ")
            .toLowerCase();
      });
      break;
    case "approvedPremises":
      myEntries.forEach((e) => {
        e.searchContent =
          `${e.entryTitle} ${stripTags(e.address)}`.toLowerCase();
      });
    default:
      console.log(`Nothing to do for ${CT}`);
      break;
  }
  return myEntries;
}
