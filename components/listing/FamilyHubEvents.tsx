"use client";
"use strict";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import EventCard from "../EventCard";
import {
  ALL_CATEGORIES,
  addYears,
  buildFamilyHubItems,
  buildLibraryItems,
  calculateDistance,
  isPostcodeValid,
  type FamilyHubItem,
} from "@/lib/eventUtils";
import styles from "./FamilyHubEvents.module.css";

import type { ListingProps } from "@/components/Canvas";

type UserLocation = {
  lat: number;
  lon: number;
};

type PostcodeResponse = {
  status: number;
  result?: {
    latitude: number;
    longitude: number;
  };
};

export default function FamilyHubEvents({ data }: ListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [distance, setDistance] = useState(10);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const hubs = data.entries.filter(
    (entry) => entry.sys.contentTypeId === "familyHubs",
  );

  const libraryEvents = data.entries.filter(
    (entry) => entry.sys.contentTypeId === "libraryActivityCopy",
  );

  const familyHubEvents = data.entries.filter(
    (entry) => entry.sys.contentTypeId === "familyHubEvents",
  );
  const libraries = hubs.filter((hub) =>
    /library|lifestyle/i.test(hub.entryTitle),
  );

  const today = new Date();
  const famItems = buildFamilyHubItems({
    events: familyHubEvents,
    today,
  });
  const libItems = buildLibraryItems({
    libraryEvents,
    libraries,
  });
  const baseItems = [...famItems, ...libItems];

  const items = useMemo<FamilyHubItem[]>(() => {
    if (!userLocation) {
      return baseItems;
    }
    return baseItems.map((item) => {
      const lat = item.hub?.location?.lat;
      const lon = item.hub?.location?.lon;
      if (lat != null && lon != null) {
        return {
          ...item,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lon,
            lat,
            lon,
          ),
        };
      }
      return {
        ...item,
        distance: undefined,
      };
    });
  }, [baseItems, userLocation]);
  const postcodeValid = isPostcodeValid(postcode);
  const hasActiveFilters =
    searchTerm.length > 0 ||
    selectedCategories.length > 0 ||
    userLocation !== null;

  const visibleTabs = useMemo<string[]>(() => {
    const towns = new Set<string>();
    baseItems.forEach((item) => {
      if (!item.hub?.town) {
        return;
      }
      const locationMatch =
        !userLocation ||
        (item.distance !== undefined && item.distance <= distance);
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          item.filterCategories.includes(category),
        );
      const searchMatch =
        !searchTerm.trim() ||
        item.searchContent.includes(searchTerm.toLowerCase().trim());

      if (locationMatch && categoryMatch && searchMatch) {
        towns.add(item.hub.town);
      }
    });
    return Array.from(towns).sort();
  }, [items, userLocation, distance, selectedCategories, searchTerm]);

  const filteredItems = useMemo(() => {
    if (!activeTab) {
      return [];
    }
    let hubItems = baseItems.filter((item) => item.hub?.town === activeTab);
    if (userLocation) {
      hubItems = hubItems.filter(
        (item) => item.distance !== undefined && item.distance <= distance,
      );
    }
    if (searchTerm.trim() || selectedCategories.length) {
      hubItems = hubItems.filter((item) => {
        const matchesSearch =
          !searchTerm.trim() ||
          item.searchContent.includes(searchTerm.toLowerCase().trim());
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.some((category) =>
            item.filterCategories.includes(category),
          );
        return matchesSearch && matchesCategory;
      });
    }
    return [...hubItems].sort((a, b) => {
      if (
        userLocation &&
        a.distance !== undefined &&
        b.distance !== undefined
      ) {
        return a.distance - b.distance;
      }
      return 0;
    });
  }, [
    items,
    activeTab,
    userLocation,
    distance,
    searchTerm,
    selectedCategories,
  ]);

  // Restore search term from URL on mount
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const q = params.get("q");
  //   if (q) {
  //     setSearchTerm(q);
  //   }
  // }, []);

  // Keep URL in sync with search term
  // useEffect(() => {
  //   const url = `${window.location.origin}${window.location.pathname}`;
  //   const params = searchTerm
  //     ? `?${new URLSearchParams({ q: searchTerm })}`
  //     : "";
  //   window.history.pushState({}, "", url + params);
  // }, [searchTerm]);

  useEffect(() => {
    if (!visibleTabs.includes(activeTab ?? "") && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0]);
    } else if (visibleTabs.length === 0) {
      setActiveTab(null);
    }
  }, [visibleTabs, activeTab]);

  const findNearbyEvents = useCallback(async (pc: string) => {
    setLoadingLocation(true);
    const clean = pc.trim().replace(/\s+/g, "");
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
      const response: PostcodeResponse = await res.json();
      if (response.status === 200 && response.result) {
        setUserLocation({
          lat: response.result.latitude,
          lon: response.result.longitude,
        });
        setPostcodeError("");
      } else {
        setPostcodeError("Postcode not found");
      }
    } catch {
      setPostcodeError("Unable to find postcode");
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (postcode.trim() === "") {
      setPostcodeError("");
      return;
    }

    if (!isPostcodeValid(postcode)) {
      setPostcodeError("Please enter a valid UK postcode");
      return;
    }

    setPostcodeError("");
    findNearbyEvents(postcode);
  }, [postcode, findNearbyEvents]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((category) => category !== cat)
        : [...prev, cat],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setUserLocation(null);
    setPostcode("");
    setDistance(10);
    setPostcodeError("");
  };

  return (
    <div className="full-bleed">
      <div className="breakout mt-3 mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">Filter and search</h2>

        <fieldset className="mt-3">
          <legend className="sr-only">Search controls</legend>

          <label htmlFor="searchInput" className="sr-only">
            Search Events
          </label>

          <input
            type="text"
            id="searchInput"
            className="w-full max-w-xs border border-gray-300 rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type here to search"
          />

          <p className={`${styles.heading} mt-3`}>Categories</p>

          <div className="columns-1 md:columns-2 lg:columns-3">
            {ALL_CATEGORIES.map((cat) => (
              <div key={cat} className="break-inside-avoid mb-1">
                <input
                  type="checkbox"
                  id={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />

                <label htmlFor={cat} className="ml-2">
                  {addYears(cat)}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p className={styles.heading}>Find events near you</p>

            <div className="mb-2 mt-2">
              <label htmlFor="postcodeInput" className="sr-only">
                Postcode
              </label>

              <input
                type="text"
                id="postcodeInput"
                className={`w-full border rounded px-3 py-2 ${
                  postcodeError ? "border-red-500" : "border-gray-300"
                }`}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter your postcode"
              />

              {postcodeError && (
                <div className="text-red-600 text-sm mt-1">{postcodeError}</div>
              )}
            </div>

            <div>
              <label htmlFor="distanceInput" className="block mb-1">
                Distance (miles)
              </label>

              <input
                type="number"
                id="distanceInput"
                className="w-16 border border-gray-300 rounded px-2 py-1 bg-white disabled:bg-gray-100"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                min={1}
                max={50}
                step={1}
                disabled={postcodeValid || false}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 border-2 border-teal-700 text-teal-700 rounded px-4 py-1 hover:bg-teal-50"
            >
              Clear filters
            </button>
          )}
        </fieldset>

        <div className="flex flex-wrap border-b border-gray-300 mt-4">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 -mb-px border-b-2 ${
                activeTab === tab
                  ? "border-teal-700 text-teal-700 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No events found matching your criteria.
            </p>
          ) : (
            filteredItems.map((item) => (
              <EventCard key={item?.sys?.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
