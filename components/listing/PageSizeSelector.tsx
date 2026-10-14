"use client";

import React from "react";

type PageSizeSelectorProps = {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  totalItems?: number;
  $className?: string;
};

/**
 * Reusable page size selector component.
 * Allows users to change how many items are displayed per page.
 */
function PageSizeSelector({
  $className,
  pageSize,
  onPageSizeChange,
  options = [10, 20, 50],
  totalItems,
}: PageSizeSelectorProps) {
  // Filter options to only include values <= totalItems if totalItems is provided
  const availableOptions =
    totalItems !== undefined
      ? options.filter((option) => totalItems >= option)
      : options;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size)) {
      onPageSizeChange(size);
    }
  };

  return (
    <>
      {availableOptions.length > 0 && (
        <div className={$className}>
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            name="pageSize"
            value={pageSize}
            onChange={handleChange}
            className="ms-1 rounded border border-gray-300 bg-gray-100 px-2 py-1"
          >
            {availableOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}

export default PageSizeSelector;
