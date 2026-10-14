import type { Entry } from "contensis-delivery-api/lib/models";
import { makeShortId, toCamelCase, formatTime } from "./helpers";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

// Sort entries by date value safely
const sortDate = (a: any, b: any) => {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
};

export type DayObj = {
  [key: string]: string[]; // Changed to string[] to hold availability slot texts ("09:00 to 17:00")
};

export type MonthArr = {
  id: string;
  arr: DayObj[][];
};

export type Calendar = {
  monthEnd: Date;
  daysInMonth: number;
  day1: string;
  dayInd: number;
  monthArr: MonthArr | DayObj[]; // Can be a raw array during building, finalises to MonthArr object
  month: number;
  year: number;
  monthStr: string;
  id: string;
};

export type Availability = {
  date: Date;
  day: number;
  from: string;
  month: number;
  monthStr: string;
  to: string;
  year: number;
  id: string;
};

export type Venue = {
  name: string;
  ind: number;
  availability: Availability[];
  cal: Calendar[];
};

const daysArr = function (n: number): DayObj[] {
  return Array.from({ length: n }, (_, i) => {
    let obj: DayObj = {};
    obj[(i + 1).toString()] = [];
    return obj;
  });
};

const chunk = function (arr: DayObj[], s = 7): DayObj[][] {
  return Array.from({ length: Math.ceil(arr.length / s) }, (_, i) => {
    let offset = i * s;
    return arr.slice(offset, s + offset);
  });
};

const calendar = (
  obj: Pick<Calendar, "year" | "month" | "monthStr">,
): Calendar => {
  let monthEnd = new Date(obj.year, obj.month + 1, 0);
  let daysInMonth = monthEnd.getDate();
  let day1 = new Date(obj.year, obj.month, 1).toLocaleString("en-GB", {
    weekday: "long",
  });
  return {
    monthEnd,
    daysInMonth,
    day1,
    dayInd: days.indexOf(day1),
    monthArr: daysArr(daysInMonth), // Initialised as raw DayObj array
    month: obj.month,
    year: obj.year,
    monthStr: obj.monthStr,
    id: makeShortId(10),
  };
};

const avail = (obj: any): Availability => {
  let from = new Date(obj.from);
  let to = new Date(obj.to);
  return {
    monthStr: from.toLocaleString("en-GB", { month: "long" }),
    month: from.getMonth(),
    year: from.getFullYear(),
    day: from.getDate(),
    from: formatTime(from),
    to: formatTime(to),
    date: from,
    id: obj.id || makeShortId(10),
  };
};

const sortMonth = (a: Calendar, b: Calendar) => {
  if (a.year !== b.year) {
    return a.year - b.year;
  } else {
    return a.month - b.month;
  }
};

// Fixed to handle both raw DayObj source arrays or existing MonthArr wrappers safely
const fillChunk = (inputArr: MonthArr | DayObj[], i: number): DayObj[][] => {
  let temp = Array.from({ length: i }, () => ({}) as DayObj);
  const flatDays = Array.isArray(inputArr) ? inputArr : inputArr.arr.flat();
  return chunk([...temp, ...flatDays]);
};

const addEmpty = (
  name: string | undefined,
  c: Calendar[],
  m: number,
  y = year,
): Calendar[] => {
  const arr = Array.from({ length: 12 - m }, (_, i) => m + i);

  return arr.reduce<Calendar[]>((acc, mon) => {
    let cal =
      c.find((e) => e.month === mon) || acc.find((e) => e.month === mon);

    if (!cal) {
      const generatedCal = calendar({
        year: y,
        month: mon,
        monthStr: months[mon],
      });

      cal = {
        ...generatedCal,
        monthArr: {
          id: `${mon}_${y}_${name}`,
          arr: fillChunk(generatedCal.monthArr, generatedCal.dayInd),
        },
      };
    }

    return [...acc, cal];
  }, []);
};

export const createVenues = (arr: Entry[]): Venue[] => {
  // Collect all the venues typed cleanly
  let venues: Venue[] = arr
    .reduce<any[]>((acc, e) => {
      return [...acc, ...(e.venue || [])];
    }, [])
    .map((v) => {
      let temp = (v.availability || []).map((e: any) => avail(e));
      temp.sort(sortDate);
      return { ...v, availability: temp, cal: [] };
    })
    .map((item) => {
      const name = toCamelCase(item.name);

      // Add initial calendar entities based on availabilities
      item.cal = item.availability.reduce(
        (acc: Calendar[], e: Availability) => {
          let monthData = calendar({
            year: e.year,
            month: e.month,
            monthStr: e.monthStr,
          });
          if (
            !acc.some(
              (m) =>
                m.monthStr === monthData.monthStr && m.year === monthData.year,
            )
          ) {
            acc.push(monthData);
          }
          return acc;
        },
        [],
      );

      item.ind = 0;

      // Map availability strings into the specific calendar dates
      item.availability.forEach((av: Availability) => {
        let tempCalendar = item.cal.find(
          (e: Calendar) => e.month === av.month && e.year === av.year,
        );
        if (tempCalendar && Array.isArray(tempCalendar.monthArr)) {
          let m = tempCalendar.monthArr[av.day - 1];
          if (m && m[av.day.toString()]) {
            m[av.day.toString()].push(`${av.from} to ${av.to}`);
          }
        }
      });

      // Structural shift: Transform raw DayObj[] arrays to finalized MonthArr chunks
      item.cal.forEach((m: Calendar) => {
        m.monthArr = {
          id: `${m.month}_${m.year}_${name}`,
          arr: fillChunk(m.monthArr, m.dayInd),
        };
      });

      item.cal.sort(sortMonth);
      return item;
    });

  // Inject trailing empty months up until calendar cycle constraints
  venues.forEach((v) => {
    if (v.cal.length === 0) return;
    const name = toCamelCase(v.name);
    let lastYear = v.cal[v.cal.length - 1].year;

    let years = Array.from({ length: lastYear - year + 1 }).map((_, i) => {
      let temp = v.cal.filter((e) => e.year === year + i);
      return i
        ? addEmpty(name, temp, 0, year + i)
        : addEmpty(name, temp, month);
    });

    v.cal = years.reduce<Calendar[]>((acc, e) => {
      return [...acc, ...e];
    }, []);
  });

  return venues;
};
