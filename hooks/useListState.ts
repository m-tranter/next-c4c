import { useState, useMemo } from "react";

interface UseListStateOptions<T, TFilters extends object> {
  data: T[];
  defaultFilters?: TFilters;
  defaultPageSize?: number;
  filterFn?: (item: T, filters: TFilters) => boolean;
  searchFn?: (item: T, query: string) => boolean;
}

export function useListState<T, TFilters extends object>({
  data,
  defaultFilters = {} as TFilters,
  defaultPageSize = 20,
  filterFn,
  searchFn,
}: UseListStateOptions<T, TFilters>) {
  const [query, setQueryRaw] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSizeRaw] = useState(defaultPageSize);
  const [filters, setFilters] = useState<TFilters>(defaultFilters);

  function setQuery(val: string) {
    setQueryRaw(val);
    setPageIndex(0);
  }

  function setPageSize(val: number) {
    setPageSizeRaw(val);
    setPageIndex(0);
  }

  function setFilter<K extends keyof TFilters>(key: K, value: TFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPageIndex(0);
  }

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterFn) {
      result = result.filter((item) => filterFn(item, filters));
    }

    // Apply search
    if (searchFn && query) {
      result = result.filter((item) => searchFn(item, query));
    }

    return result;
  }, [data, filters, query, filterFn, searchFn]);

  const total = processedData.length;

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, pageIndex, pageSize]);

  return {
    query,
    setQuery,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filters,
    setFilter,
    data: paginatedData,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
